const generateDate = ({
                          random,
                          year = 2017,
                          month = rand => Math.floor(rand() * 12),
                          day = rand => Math.floor(rand() * 30) + 1,
                      }) => {
    const getPart = part => (typeof part === 'function' ? part(random) : part);
    const date = new Date(Date.UTC(getPart(year), getPart(month), getPart(day)));
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};



export const globalSalesValues = {
    region: ['Asia', 'Europe', 'North America', 'South America', 'Australia', 'Africa'],
    sector: ['Energy', 'Health', 'Manufacturing', 'Insurance', 'Banking', 'Telecom'],
    channel: ['Resellers', 'Retail', 'VARs', 'Consultants', 'Direct', 'Telecom'],
    customer: [
        'Renewable Supplies', 'Energy Systems', 'Environment Solar', 'Beacon Systems', 'Apollo Inc',
        'Gemini Stores', 'McCord Builders', 'Building M Inc', 'Global Services',
        'Market Eco', 'Johnson & Assoc', 'Get Solar Inc', 'Supply Warehouse', 'Discovery Systems', 'Mercury Solar'],
    player: ['playerA', 'playerB', 'playerC'],
    amount: ({ random }) => Math.floor(random() * 10000) + 1000,
    discount: ({ random }) => Math.round(random() * 0.5 * 1000) / 1000,
    saleDate: ({ random }) => generateDate({
        random,
        year: 2016,
        month: () => Math.floor(random() * 3) + 1,
    }),
    shipped: [true, false],
};