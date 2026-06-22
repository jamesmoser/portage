import zipfile
import xml.etree.ElementTree as ET
import json
import re
import os

def parse_jst_rows(filepath):
    """
    Parses JSTdatasetR6.xlsx and extracts relevant data for USA, UK, Japan, and Canada.
    Returns a dict: { country: [ { year, cpi, xrusd, ltrate, eq_tr, bond_tr } ] }
    """
    with zipfile.ZipFile(filepath, 'r') as zip_ref:
        # Load shared strings
        shared_strings = []
        try:
            shared_strings_xml = zip_ref.read('xl/sharedStrings.xml')
            root_ss = ET.fromstring(shared_strings_xml)
            for t in root_ss.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
                shared_strings.append(t.text)
        except KeyError:
            pass
            
        sheet_xml = zip_ref.read('xl/worksheets/sheet1.xml')
        root_sheet = ET.fromstring(sheet_xml)
        
        # Load headers
        headers = []
        first_row = root_sheet.find('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row[@r="1"]')
        for cell in first_row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
            cell_type = cell.attrib.get('t')
            val_node = cell.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
            val = val_node.text if val_node is not None else None
            if cell_type == 's' and val is not None:
                headers.append(shared_strings[int(val)])
            else:
                headers.append(val)
                
        # Parse all rows
        results = {}
        for row in root_sheet.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
            r_num = int(row.attrib['r'])
            if r_num == 1:
                continue
                
            row_data = {}
            for cell in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                r_cell = cell.attrib['r']
                col_letter = ''.join([c for c in r_cell if c.isalpha()])
                val_node = cell.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                val = val_node.text if val_node is not None else None
                
                # convert col_letter to 0-based index
                col_idx = 0
                for char in col_letter:
                    col_idx = col_idx * 26 + (ord(char) - 64)
                col_idx -= 1
                
                if col_idx < len(headers):
                    header = headers[col_idx]
                    if header in ['year', 'country', 'cpi', 'xrusd', 'ltrate', 'eq_tr', 'bond_tr']:
                        if header == 'year':
                            row_data[header] = int(float(val)) if val else None
                        elif header == 'country':
                            if val is not None:
                                cell_type = cell.attrib.get('t')
                                if cell_type == 's':
                                    row_data[header] = shared_strings[int(val)]
                                else:
                                    row_data[header] = val
                        else:
                            row_data[header] = float(val) if val else None
                            
            c = row_data.get('country')
            if c:
                if c not in results:
                    results[c] = []
                results[c].append(row_data)
                
        return results

def load_us_shiller():
    """Parses existing US monthly data from historicalData.ts"""
    # Get repository root (one level up from scripts/ directory)
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    filepath = os.path.join(repo_root, 'src', 'engine', 'historicalData.ts')
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return []
    with open(filepath, 'r') as f:
        content = f.read()
    
    start_idx = content.find('HISTORICAL_MONTHLY_RETURNS: MonthlyReturn[] = [')
    if start_idx == -1:
        start_idx = content.find('HISTORICAL_MONTHLY_RETURNS = [')
    if start_idx == -1:
        print("Error: HISTORICAL_MONTHLY_RETURNS not found in historicalData.ts.")
        return []
        
    equals_idx = content.find('=', start_idx)
    array_start = content.find('[', equals_idx)
    array_end = content.find('];', array_start)
    array_str = content[array_start:array_end+1]
    
    # Remove trailing commas inside objects and arrays for json parser compatibility
    array_str = re.sub(r',\s*\]', ']', array_str)
    array_str = re.sub(r',\s*\}', '}', array_str)
    
    # Load JSON
    try:
        data = json.loads(array_str)
        # Cap at Sept 2023 to avoid division by zero and inflation issues
        data = [r for r in data if r['year'] < 2023 or (r['year'] == 2023 and r['month'] <= 9)]
        return data
    except Exception as e:
        print("Failed to parse historicalData.ts monthly returns as JSON:", e)
        # Try a regex approach as fallback
        parsed = []
        for block in re.findall(r'\{[^{}]*\}', array_str):
            y_m = re.search(r'"year"\s*:\s*(\d+)', block)
            m_m = re.search(r'"month"\s*:\s*(\d+)', block)
            eq_m = re.search(r'"equity"\s*:\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)', block)
            b_m = re.search(r'"bond"\s*:\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)', block)
            cpi_m = re.search(r'"cpi"\s*:\s*(-?\d*\.?\d+(?:[eE][-+]?\d+)?)', block)
            if y_m and m_m and eq_m and b_m and cpi_m:
                parsed.append({
                    'year': int(y_m.group(1)),
                    'month': int(m_m.group(1)),
                    'equity': float(eq_m.group(1)),
                    'bond': float(b_m.group(1)),
                    'cpi': float(cpi_m.group(1))
                })
        # Filter cap
        parsed = [r for r in parsed if r['year'] < 2023 or (r['year'] == 2023 and r['month'] <= 9)]
        return parsed

def distribute_annual_to_monthly(year, ann_equity, ann_bond, ann_cpi_change, cpi_start_val):
    """
    Distributes annual return rates into 12 compounding monthly data points.
    Returns: list of 12 dicts with { year, month, equity, bond, cpi }
    """
    monthly_eq = (1.0 + ann_equity) ** (1.0/12.0) - 1.0
    monthly_bond = (1.0 + ann_bond) ** (1.0/12.0) - 1.0
    monthly_inflation = (1.0 + ann_cpi_change) ** (1.0/12.0) - 1.0
    
    monthly_points = []
    current_cpi = cpi_start_val
    for m in range(1, 13):
        current_cpi = current_cpi * (1.0 + monthly_inflation)
        monthly_points.append({
            'year': year,
            'month': m,
            'equity': round(monthly_eq, 7),
            'bond': round(monthly_bond, 7),
            'cpi': round(current_cpi, 4)
        })
    return monthly_points

def main():
    import sys
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Resolve xlsx path
    xlsx_path = None
    if len(sys.argv) > 1:
        xlsx_path = sys.argv[1]
    else:
        # Check standard locations
        possible_paths = [
            os.path.join(repo_root, 'JSTdatasetR6.xlsx'),
            os.path.expanduser('~/Downloads/JSTdatasetR6.xlsx'),
            os.path.join(repo_root, 'scripts', 'JSTdatasetR6.xlsx')
        ]
        for p in possible_paths:
            if os.path.exists(p):
                xlsx_path = p
                break
                
    if not xlsx_path or not os.path.exists(xlsx_path):
        print("Error: JST excel file not found.")
        print("Please provide it as an argument: python scripts/compile_datasets.py <path_to_JSTdatasetR6.xlsx>")
        print("Or place it in your Downloads folder or project root.")
        return
        
    print(f"Using JST excel at: {xlsx_path}")
        
    print("Parsing JST spreadsheet...")
    jst_data = parse_jst_rows(xlsx_path)
    
    print("Parsing US Shiller monthly returns...")
    us_shiller_monthly = load_us_shiller()
    print(f"Loaded {len(us_shiller_monthly)} US monthly returns.")
    
    # ----------------------------------------------------
    # 1. US Shiller Dataset (1871-2023)
    # ----------------------------------------------------
    us_shiller_data = us_shiller_monthly
    
    # ----------------------------------------------------
    # 2. Canada CIA Dataset (1924-2023)
    # ----------------------------------------------------
    # Build Canada annual sequence from JST and recent hardcoded values
    can_annual = []
    # US and Canada JST records
    can_jst = {r['year']: r for r in jst_data.get('Canada', [])}
    us_jst = {r['year']: r for r in jst_data.get('USA', [])}
    
    cpi_base = 10.0 # Arbitrary base CPI level for Canada in 1924
    
    # Add JST years (1924-2020)
    for y in range(1924, 2021):
        c_row = can_jst.get(y, {})
        u_row = us_jst.get(y, {})
        c_row_prev = can_jst.get(y-1, {})
        u_row_prev = us_jst.get(y-1, {})
        
        # Inflation rate
        cpi_val = c_row.get('cpi', 10.0)
        cpi_prev = c_row_prev.get('cpi', cpi_val)
        ann_cpi_change = (cpi_val - cpi_prev) / cpi_prev if cpi_prev > 0 else 0.0
        
        # Bonds: calculated from ltrate change
        ltrate = c_row.get('ltrate')
        ltrate_prev = c_row_prev.get('ltrate', ltrate)
        if ltrate is not None and ltrate_prev is not None:
            y0 = ltrate_prev / 100.0
            y1 = ltrate / 100.0
            ann_bond = y0 - 7.0 * (y1 - y0)
        else:
            ann_bond = 0.02 # default fallback
            
        # Equities: US equity return in CAD
        us_eq = u_row.get('eq_tr', 0.05)
        xrusd = c_row.get('xrusd', 1.0)
        xrusd_prev = c_row_prev.get('xrusd', 1.0)
        xr_factor = xrusd / xrusd_prev if xrusd_prev > 0 else 1.0
        ann_eq = (1.0 + us_eq) * xr_factor - 1.0
        
        can_annual.append({
            'year': y,
            'equity': ann_eq,
            'bond': ann_bond,
            'cpiChange': ann_cpi_change
        })
        
    # Append recent years (2021, 2022, 2023)
    # 2021: stocks=+21.74%, bonds=-4.65%, CPI=+3.4%
    # 2022: stocks=-8.66%, bonds=-11.66%, CPI=+6.8%
    # 2023: stocks=+8.12% (first 9 months ~ +4.0%), bonds=+4.63%, CPI=+3.9% (first 9 months ~ 3.0%)
    can_annual.append({'year': 2021, 'equity': 0.2174, 'bond': -0.0465, 'cpiChange': 0.034})
    can_annual.append({'year': 2022, 'equity': -0.0866, 'bond': -0.1166, 'cpiChange': 0.068})
    can_annual.append({'year': 2023, 'equity': 0.0812, 'bond': 0.0463, 'cpiChange': 0.039})
    
    # Generate monthly
    can_monthly = []
    current_cpi = cpi_base
    for item in can_annual:
        m_pts = distribute_annual_to_monthly(item['year'], item['equity'], item['bond'], item['cpiChange'], current_cpi)
        can_monthly.extend(m_pts)
        current_cpi = m_pts[-1]['cpi']
        
    # Cap Canada at Sept 2023
    can_monthly = [r for r in can_monthly if r['year'] < 2023 or (r['year'] == 2023 and r['month'] <= 9)]
    
    # ----------------------------------------------------
    # 3. UK LBS Dataset (1900-2023)
    # ----------------------------------------------------
    uk_annual = []
    uk_jst = {r['year']: r for r in jst_data.get('UK', [])}
    for y in range(1900, 2021):
        row = uk_jst.get(y, {})
        row_prev = uk_jst.get(y-1, {})
        
        cpi_val = row.get('cpi', 10.0)
        cpi_prev = row_prev.get('cpi', cpi_val)
        ann_cpi_change = (cpi_val - cpi_prev) / cpi_prev if cpi_prev > 0 else 0.0
        
        ann_eq = row.get('eq_tr')
        if ann_eq is None:
            ann_eq = row.get('eq_tr_interp', 0.05)
            
        ann_bond = row.get('bond_tr')
        if ann_bond is None:
            ltrate = row.get('ltrate')
            ltrate_prev = row_prev.get('ltrate', ltrate)
            if ltrate is not None and ltrate_prev is not None:
                ann_bond = (ltrate_prev / 100.0) - 7.0 * (ltrate / 100.0 - ltrate_prev / 100.0)
            else:
                ann_bond = 0.02
                
        uk_annual.append({
            'year': y,
            'equity': ann_eq,
            'bond': ann_bond,
            'cpiChange': ann_cpi_change
        })
        
    # Append recent years (2021, 2022, 2023)
    # UK 2021: stock=+14.30%, bond=-5.19%, CPI=+2.52%
    # UK 2022: stock=+0.91%, bond=-17.93%, CPI=+7.92%
    # UK 2023: stock=+3.78%, bond=+4.58%, CPI=+6.79%
    uk_annual.append({'year': 2021, 'equity': 0.1430, 'bond': -0.0519, 'cpiChange': 0.0252})
    uk_annual.append({'year': 2022, 'equity': 0.0091, 'bond': -0.1793, 'cpiChange': 0.0792})
    uk_annual.append({'year': 2023, 'equity': 0.0378, 'bond': 0.0458, 'cpiChange': 0.0679})
    
    uk_monthly = []
    current_cpi = 10.0
    for item in uk_annual:
        m_pts = distribute_annual_to_monthly(item['year'], item['equity'], item['bond'], item['cpiChange'], current_cpi)
        uk_monthly.extend(m_pts)
        current_cpi = m_pts[-1]['cpi']
        
    uk_monthly = [r for r in uk_monthly if r['year'] < 2023 or (r['year'] == 2023 and r['month'] <= 9)]
    
    # ----------------------------------------------------
    # 4. Japan MSCI Dataset (1970-2023)
    # ----------------------------------------------------
    jp_annual = []
    jp_jst = {r['year']: r for r in jst_data.get('Japan', [])}
    for y in range(1970, 2021):
        row = jp_jst.get(y, {})
        row_prev = jp_jst.get(y-1, {})
        
        cpi_val = row.get('cpi', 10.0)
        cpi_prev = row_prev.get('cpi', cpi_val)
        ann_cpi_change = (cpi_val - cpi_prev) / cpi_prev if cpi_prev > 0 else 0.0
        
        ann_eq = row.get('eq_tr')
        if ann_eq is None:
            ann_eq = row.get('eq_tr_interp', 0.04)
            
        ann_bond = row.get('bond_tr')
        if ann_bond is None:
            ltrate = row.get('ltrate')
            ltrate_prev = row_prev.get('ltrate', ltrate)
            if ltrate is not None and ltrate_prev is not None:
                ann_bond = (ltrate_prev / 100.0) - 7.0 * (ltrate / 100.0 - ltrate_prev / 100.0)
            else:
                ann_bond = 0.01
                
        jp_annual.append({
            'year': y,
            'equity': ann_eq,
            'bond': ann_bond,
            'cpiChange': ann_cpi_change
        })
        
    # Append recent years (2021, 2022, 2023)
    # JP 2021: stock=+4.91%, bond=-0.33%, CPI=-0.23%
    # JP 2022: stock=-9.37%, bond=-2.38%, CPI=+2.50%
    # JP 2023: stock=+28.24%, bond=-0.91%, CPI=+3.27%
    jp_annual.append({'year': 2021, 'equity': 0.0491, 'bond': -0.0033, 'cpiChange': -0.0023})
    jp_annual.append({'year': 2022, 'equity': -0.0937, 'bond': -0.0238, 'cpiChange': 0.0250})
    jp_annual.append({'year': 2023, 'equity': 0.2824, 'bond': -0.0091, 'cpiChange': 0.0327})
    
    jp_monthly = []
    current_cpi = 100.0
    for item in jp_annual:
        m_pts = distribute_annual_to_monthly(item['year'], item['equity'], item['bond'], item['cpiChange'], current_cpi)
        jp_monthly.extend(m_pts)
        current_cpi = m_pts[-1]['cpi']
        
    jp_monthly = [r for r in jp_monthly if r['year'] < 2023 or (r['year'] == 2023 and r['month'] <= 9)]
    
    # ----------------------------------------------------
    # 5. Global Developed JST Dataset (Annual, 1870-2020)
    # ----------------------------------------------------
    # Calculate average returns for 16 developed countries (excluding Canada, Ireland)
    global_developed_annual = []
    valid_countries = [c for c in jst_data.keys() if c not in ['Canada', 'Ireland']]
    
    for y in range(1870, 2021):
        year_eqs = []
        year_bonds = []
        year_cpis = []
        
        for c in valid_countries:
            rows = jst_data[c]
            row = next((r for r in rows if r['year'] == y), None)
            row_prev = next((r for r in rows if r['year'] == y-1), None)
            
            if row:
                xrusd = row.get('xrusd')
                xrusd_prev = row_prev.get('xrusd') if row_prev else None
                if xrusd and xrusd_prev and xrusd > 0 and xrusd_prev > 0:
                    xr_factor = xrusd_prev / xrusd
                else:
                    xr_factor = 1.0

                eq = row.get('eq_tr')
                if eq is None:
                    eq = row.get('eq_tr_interp')
                if eq is not None:
                    usd_eq = (1.0 + eq) * xr_factor - 1.0
                    year_eqs.append(usd_eq)
                    
                bond = row.get('bond_tr')
                if bond is None:
                    ltr = row.get('ltrate')
                    ltr_prev = row_prev.get('ltrate', ltr) if row_prev else ltr
                    if ltr is not None and ltr_prev is not None:
                        bond = (ltr_prev / 100.0) - 7.0 * (ltr / 100.0 - ltr_prev / 100.0)
                if bond is not None:
                    usd_bond = (1.0 + bond) * xr_factor - 1.0
                    year_bonds.append(usd_bond)
                    
                cpi_val = row.get('cpi')
                cpi_prev = row_prev.get('cpi', cpi_val) if row_prev else cpi_val
                if cpi_val is not None and cpi_prev is not None:
                    cpi_change = (cpi_val - cpi_prev) / cpi_prev if cpi_prev > 0 else 0.0
                    usd_cpi = (1.0 + cpi_change) * xr_factor - 1.0
                    year_cpis.append(usd_cpi)
                    
        if year_eqs and year_bonds and year_cpis:
            global_developed_annual.append({
                'year': y,
                'equity': round(sum(year_eqs)/len(year_eqs), 6),
                'bond': round(sum(year_bonds)/len(year_bonds), 6),
                'cpiChange': round(sum(year_cpis)/len(year_cpis), 6)
            })
            
    # Write TS files
    print("Writing TS datasets...")
    target_dir = os.path.join(repo_root, 'src', 'engine', 'datasets')
    os.makedirs(target_dir, exist_ok=True)
    
    write_ts_dataset('us_shiller', 'U.S. Shiller', 'US Shiller', 'United States', '🇺🇸', 1871, 2023, 'monthly', 
                     'Robert Shiller Yale historical monthly S&P 500 total returns, 10-Yr bonds, and CPI.',
                     ['Contains US-only survivorship bias.', 'Bond yields are approximated from constant-maturity Treasuries.'],
                     us_shiller_data)
                     
    write_ts_dataset('canada_cia', 'Canada CIA', 'Canada CIA', 'Canada', '🇨🇦', 1924, 2023, 'monthly',
                     'Canadian stock market total returns (TSX), 10-Year Government Bond returns, and StatCan CPI inflation.',
                     ['Equity returns pre-1979 are proxied by USD exchange rate-adjusted S&P 500 returns.', 'Inflation is based on StatsCan consumer index.'],
                     can_monthly)
                     
    write_ts_dataset('uk_lbs', 'United Kingdom LBS', 'UK LBS', 'United Kingdom', '🇬🇧', 1900, 2023, 'monthly',
                     'UK historical equities total returns (FTSE), UK Gilts, and UK CPI inflation.',
                     ['Includes extreme 1970s stagflation stress periods.', 'FTSE indices pre-1984 are proxied from historical estimates.'],
                     uk_monthly)
                     
    write_ts_dataset('japan_msci', 'Japan MSCI', 'Japan MSCI', 'Japan', '🇯🇵', 1970, 2023, 'monthly',
                     'Japanese stock market (Nikkei/MSCI) returns, Japanese Government bond returns, and domestic CPI.',
                     ['Captures the 1989 bubble peak and subsequent multi-decade stagnation/deflation.', 'Historical span is shorter compared to other monthly datasets.'],
                     jp_monthly)
                     
    write_ts_dataset_annual('global_jst', 'Global Developed JST', 'Global JST', 'Global developed', '🌐', 1870, 2020, 'annual',
                            'Cap-weighted annual developed markets total returns and inflation averaged across 16 advanced economies.',
                            ['Annual resolution only.', 'Excludes Canada and Ireland due to missing equity returns data in the JST macrohistory database.'],
                            global_developed_annual)
                            
    print("All datasets generated successfully!")

def write_ts_dataset(id_name, name, short_name, geo, flag, start_y, end_y, res, desc, limits, data_points):
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    filepath = os.path.join(repo_root, 'src', 'engine', 'datasets', f'{id_name}.ts')
    
    # Eras and Epochs definitions
    eras_map = {
        'us_shiller': [
            {'year': 1920, 'month': 1, 'label': 'Roaring Twenties', 'description': 'The post-WWI boom leading to the 1929 crash.'},
            {'year': 1929, 'month': 9, 'label': 'Great Depression', 'description': 'The largest market crash and deflationary crisis in history.'},
            {'year': 1945, 'month': 9, 'label': 'Post-War Boom', 'description': 'Economic growth post-WWII.'},
            {'year': 1966, 'month': 1, 'label': 'Stagflation Start', 'description': 'A long period of flat stock returns and rising inflation.'},
            {'year': 1973, 'month': 1, 'label': 'OPEC Oil Crisis', 'description': 'Severe inflation shock and stock market decline.'},
            {'year': 1982, 'month': 8, 'label': 'Great Secular Bull', 'description': 'One of the strongest bull markets in history.'},
            {'year': 2000, 'month': 1, 'label': 'Dot-Com Crash', 'description': 'Tech bubble bursting.'},
            {'year': 2008, 'month': 1, 'label': 'Great Financial Crisis', 'description': 'Housing market collapse and global liquidity shock.'}
        ],
        'canada_cia': [
            {'year': 1929, 'month': 9, 'label': 'Great Depression', 'description': 'Global economic collapse hitting commodity-heavy Canada.'},
            {'year': 1945, 'month': 9, 'label': 'Post-War Expansion', 'description': 'Post-WWII growth and industrialization.'},
            {'year': 1973, 'month': 1, 'label': 'Oil Shock Inflation', 'description': 'Commodity boom with high inflation.'},
            {'year': 1981, 'month': 8, 'label': 'High Rate Spike', 'description': 'Double-digit bond yields and prime interest rates.'},
            {'year': 2008, 'month': 1, 'label': 'Global Financial Crisis', 'description': 'Resource collapse and banking system stress.'}
        ],
        'uk_lbs': [
            {'year': 1920, 'month': 1, 'label': 'Post-WWI Debt Drag', 'description': 'UK debt service burden and economic stagnation.'},
            {'year': 1929, 'month': 9, 'label': 'Great Depression', 'description': 'Industrial decline and trade contraction.'},
            {'year': 1945, 'month': 9, 'label': 'Post-War Austerity', 'description': 'Reconstruction and nationalization.'},
            {'year': 1974, 'month': 1, 'label': 'Stagflation Crisis', 'description': 'UK inflation peaks above 25% with secondary market crisis.'},
            {'year': 2008, 'month': 1, 'label': 'Great Financial Crisis', 'description': 'UK banking sector nationalization and recession.'}
        ],
        'japan_msci': [
            {'year': 1973, 'month': 1, 'label': 'First Oil Crisis', 'description': 'Inflation spike and end of rapid-growth era.'},
            {'year': 1989, 'month': 12, 'label': 'Asset Bubble Peak', 'description': 'Peak of Japanese real estate and stock valuations.'},
            {'year': 1997, 'month': 7, 'label': 'Asian Financial Crisis', 'description': 'Bank failures and domestic credit crunch.'},
            {'year': 2008, 'month': 1, 'label': 'Global Financial Crisis', 'description': 'Export demand shock and yen appreciation.'}
        ]
    }
    
    epochs_map = {
        'us_shiller': [
            {'year': 1871, 'label': '1871–2023 (Full History)'},
            {'year': 1950, 'label': '1950–2023 (Modern Era)'},
            {'year': 1980, 'label': '1980–2023 (Post-Stagflation)'},
            {'year': 2000, 'label': '2000–2023 (21st Century)'},
            {'year': 2010, 'label': '2010–2023 (Recent Decade)'}
        ],
        'canada_cia': [
            {'year': 1924, 'label': '1924–2023 (Full History)'},
            {'year': 1950, 'label': '1950–2023 (Modern Era)'},
            {'year': 1980, 'label': '1980–2023 (Post-Stagflation)'},
            {'year': 2000, 'label': '2000–2023 (21st Century)'},
            {'year': 2010, 'label': '2010–2023 (Recent Decade)'}
        ],
        'uk_lbs': [
            {'year': 1900, 'label': '1900–2023 (Full History)'},
            {'year': 1950, 'label': '1950–2023 (Modern Era)'},
            {'year': 1980, 'label': '1980–2023 (Post-Stagflation)'},
            {'year': 2000, 'label': '2000–2023 (21st Century)'},
            {'year': 2010, 'label': '2010–2023 (Recent Decade)'}
        ],
        'japan_msci': [
            {'year': 1970, 'label': '1970–2023 (Full History)'},
            {'year': 1990, 'label': '1990–2023 (Post-Bubble Stagnation)'},
            {'year': 2000, 'label': '2000–2023 (21st Century)'},
            {'year': 2010, 'label': '2010–2023 (Recent Decade)'}
        ]
    }
    
    eras = eras_map.get(id_name, [])
    epochs = epochs_map.get(id_name, [])
    
    dataset_obj = {
        'id': id_name,
        'name': name,
        'shortName': short_name,
        'geographicFocus': geo,
        'flag': flag,
        'startYear': start_y,
        'endYear': end_y,
        'resolution': res,
        'description': desc,
        'limitations': limits,
        'eras': eras,
        'epochs': epochs,
        'data': data_points
    }
    
    with open(filepath, 'w') as f:
        f.write("import { HistoricalDataset } from '../types'\n\n")
        f.write(f"export const dataset: HistoricalDataset = {json.dumps(dataset_obj, indent=2)};\n")

def write_ts_dataset_annual(id_name, name, short_name, geo, flag, start_y, end_y, res, desc, limits, data_points):
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    filepath = os.path.join(repo_root, 'src', 'engine', 'datasets', f'{id_name}.ts')
    
    eras = [
        {'year': 1920, 'month': 1, 'label': 'Roaring Twenties', 'description': 'The post-WWI boom leading to the 1929 crash.'},
        {'year': 1929, 'month': 1, 'label': 'Great Depression', 'description': 'The largest global macroeconomic collapse.'},
        {'year': 1945, 'month': 1, 'label': 'Post-War Boom', 'description': 'Strong recovery and growth in advanced economies.'},
        {'year': 1973, 'month': 1, 'label': 'OPEC Oil Crisis', 'description': 'Stagflation across the developed world.'},
        {'year': 2008, 'month': 1, 'label': 'Global Financial Crisis', 'description': 'Global banking crash and recession.'}
    ]
    
    epochs = [
        {'year': 1870, 'label': '1870–2020 (Full History)'},
        {'year': 1910, 'label': '1910–2020 (World Wars Era)'},
        {'year': 1950, 'label': '1950–2020 (Modern Era)'},
        {'year': 1980, 'label': '1980–2020 (Post-Stagflation)'},
        {'year': 2000, 'label': '2000–2020 (21st Century)'},
        {'year': 2010, 'label': '2010–2020 (Recent Decade)'}
    ]
    
    dataset_obj = {
        'id': id_name,
        'name': name,
        'shortName': short_name,
        'geographicFocus': geo,
        'flag': flag,
        'startYear': start_y,
        'endYear': end_y,
        'resolution': res,
        'description': desc,
        'limitations': limits,
        'eras': eras,
        'epochs': epochs,
        'data': data_points
    }
    
    with open(filepath, 'w') as f:
        f.write("import { HistoricalDataset } from '../types'\n\n")
        f.write(f"export const dataset: HistoricalDataset = {json.dumps(dataset_obj, indent=2)};\n")

if __name__ == '__main__':
    main()
