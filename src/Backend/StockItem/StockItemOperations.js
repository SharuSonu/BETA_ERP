const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const moment = require('moment');

const router = express.Router();
router.use(bodyParser.json());


// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Admin@12345',
    // No database specified here
};


const getDatabaseName = (organizationName) => {
    const dbNamePrefix = "erp_";
    return dbNamePrefix + organizationName.toLowerCase().replace(/\s+/g, '_');
  };

// Function to create a stock item
async function createStockItem(reqBody) {
    const { 
        name, alias, Group, partNo, under, units, alternateUnits, 
        gstApplicable, gstDetails, openingBalance, openingBalanceRate, openingBalanceValue, 
        openingBalanceBreakupData, databaseName 
    } = reqBody;

    const dbNamePrefix = "ERP_";
    const dbName = dbNamePrefix + databaseName.toLowerCase().replace(/\s+/g, '_');
    let connection;

    try {
        // Create a connection to the database
        connection = await mysql.createConnection({ ...dbConfig, database: dbName });

        // Create the stockitem table if it does not exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS stockitem (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                group_alias VARCHAR(255),
                partNo VARCHAR(255),
                parentGroup VARCHAR(255),
                units VARCHAR(50),
                alternateUnits VARCHAR(50),
                gstApplicable BOOLEAN,
                openingBalance DECIMAL(15, 2),
                openingBalanceRate DECIMAL(15, 2),
                openingBalanceValue DECIMAL(15, 2)
            )
        `);

        // Insert stock item data
        const [insertResult] = await connection.query(`
            INSERT INTO stockitem (name, group_alias, partNo, parentGroup, units, alternateUnits, gstApplicable, openingBalance, openingBalanceRate, openingBalanceValue)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, alias || '', partNo, Group || 'Primary', under, units, alternateUnits, gstApplicable === 'yes', openingBalance || 0, openingBalanceRate || 0, openingBalanceValue || 0]);

        const stockItemId = insertResult.insertId;

        if (gstApplicable === 'yes' && gstDetails && gstDetails.length > 0) {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS sku_gst_details (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    stockItemId INT,
                    applicableDate DATE,
                    hsnSacDetails VARCHAR(255),
                    hsn VARCHAR(255),
                    taxability VARCHAR(255),
                    gstRate DECIMAL(5, 2),
                    FOREIGN KEY (stockItemId) REFERENCES stockitem(id) ON DELETE CASCADE
                )
            `);

            for (const gstDetail of gstDetails) {
                const { applicableDate, hsnSacDetails, hsn, taxability, gstRate } = gstDetail;
                await connection.query(`
                    INSERT INTO sku_gst_details (stockItemId, applicableDate, hsnSacDetails, hsn, taxability, gstRate)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [stockItemId, applicableDate, hsnSacDetails, hsn, taxability, gstRate]);
            }
        }
        
        if (openingBalanceBreakupData.length > 0 && openingBalanceBreakupData[0].amount > 0) {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS sku_opening_balance(
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    stockItemId INT,
                    godown VARCHAR(255),
                    batch VARCHAR(255),
                    ratePer DECIMAL(15, 2),
                    amount DECIMAL(15, 2),
                    FOREIGN KEY (stockItemId) REFERENCES stockitem(id) ON DELETE CASCADE
                )
            `);

            for (const breakup of openingBalanceBreakupData) {
                const { godown, batch, ratePer, amount } = breakup;
                await connection.query(`
                    INSERT INTO sku_opening_balance(stockItemId, godown, batch, ratePer, amount)
                    VALUES (?, ?, ?, ?, ?)
                `, [stockItemId, godown, batch, ratePer, amount]);
            }
        }

        return stockItemId;
    } catch (err) {
        console.error('Error:', err);
        throw err; // Throw the error to handle it in the calling function
    } finally {
        if (connection) {
            // Close the connection
            await connection.end();
        }
    }
}

// POST endpoint to create a stock item
router.post('/create-stockitem', async (req, res) => {
    try {
        const stockItemId = await createStockItem(req.body);
        res.status(201).json({ success: true, stockItemId });
    } catch (error) {
        console.error('Error creating stock item:', error);
        res.status(500).json({ success: false, message: 'Error creating stock item' });
    }
});


// Function to create product cost prices
async function createProductCostPrice(reqBody) {
    const { companyName, productId, costPrices } = reqBody;

    // Construct database name based on company name
    const dbNamePrefix = "ERP_";
    const dbName = dbNamePrefix + companyName.toLowerCase().replace(/\s+/g, '_');
    let connection;

    try {
        // Create a connection to the database
        connection = await mysql.createConnection({ ...dbConfig, database: dbName });

        // Create the product_cost_price table if it does not exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS product_cost_price (
                id INT AUTO_INCREMENT PRIMARY KEY,
                productId INT,
                costPrice DECIMAL(15, 2),
                applicableDate DATE,
                org_id INT
            )
        `);

        const [orgResult] = await connection.query(`
            SELECT id FROM organization WHERE name = ?
        `, [companyName]);

        const org_id = orgResult[0].id;

        // Insert cost price data
        for (const costPrice of costPrices) {
            const { price, applicableDate, userId } = costPrice;
            const formattedDate = moment(applicableDate).format('YYYY-MM-DD');
            await connection.query(`
                INSERT INTO product_cost_price (productId, costPrice, applicableDate, org_id)
                VALUES (?, ?, ?, ?)
            `, [productId, price, formattedDate, org_id]);
        }

        return productId;
    } catch (err) {
        console.error('Error:', err);
        throw err; // Throw the error to handle it in the calling function
    } finally {
        if (connection) {
            // Close the connection
            await connection.end();
        }
    }
}

router.post('/save-cost-prices', async (req, res) => {
    try {
        const productId = await createProductCostPrice(req.body);
        res.status(201).json({ success: true, productId });
    } catch (error) {
        console.error('Error creating ProductCostPrice:', error);
        res.status(500).json({ success: false, message: 'Error creating ProductCostPrice' });
    }
});


// Function to create product Selling prices
async function createProductSellingPrice(reqBody) {
    const { companyName, productId, sellingPrices, userName } = reqBody;

    // Construct database name based on company name
    const dbNamePrefix = "ERP_";
    const dbName = dbNamePrefix + companyName.toLowerCase().replace(/\s+/g, '_');
    let connection;

    try {
        // Create a connection to the database
        connection = await mysql.createConnection({ ...dbConfig, database: dbName });

        // Create the product_selling_price table if it does not exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS product_selling_price (
                id INT AUTO_INCREMENT PRIMARY KEY,
                productId INT,
                sellingPrices DECIMAL(15, 2),
                applicableDate DATE,
                userName VARCHAR(255),
                org_id Int
            )
        `);

        const [orgResult] = await connection.query(`
            SELECT id FROM organization WHERE name = ?
        `, [companyName]);

        const org_id = orgResult[0].id;

        // Insert selling price data
        for (const sellingPrice of sellingPrices) {
            const { price, applicableDate, userName } = sellingPrice;
            const formattedDate = moment(applicableDate).format('YYYY-MM-DD');
            await connection.query(`
                INSERT INTO product_selling_price (productId, sellingPrices, applicableDate, userName, org_id)
                VALUES (?, ?, ?, ?, ?)
            `, [productId, price, formattedDate, userName, org_id]);
        }

        return productId;
    } catch (err) {
        console.error('Error:', err);
        throw err; // Throw the error to handle it in the calling function
    } finally {
        if (connection) {
            // Close the connection
            await connection.end();
        }
    }
}
router.post('/save-selling-prices', async (req, res) => {
    try {
        const productId = await createProductSellingPrice(req.body);
        res.status(201).json({ success: true, productId });
    } catch (error) {
        console.error('Error creating ProductSellingPrice:', error);
        res.status(500).json({ success: false, message: 'Error creating ProductSellingPrice' });
    }
});


async function createProductDiscounts(reqBody) {
    const { companyName, productId, discounts } = reqBody;

    // Construct database name based on company name
    const dbNamePrefix = "ERP_";
    const dbName = dbNamePrefix + companyName.toLowerCase().replace(/\s+/g, '_');
    let connection;

    try {
        // Create a connection to the database
        connection = await mysql.createConnection({ ...dbConfig, database: dbName });

        // Create the product_selling_price table if it does not exist
        await connection.query(`
            CREATE TABLE IF NOT EXISTS productdiscounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                productId INT,
                discount DECIMAL(15, 2),
                applicableDate DATE,
                userName VARCHAR(255),
                thresholdValue Int,
                org_id Int
            )
        `);

        const [orgResult] = await connection.query(`
            SELECT id FROM organization WHERE name = ?
        `, [companyName]);

        const org_id = orgResult[0].id;

        // Insert selling price data
        for (const productdiscount of discounts) {
            const { discount, applicableDate, userName, thresholdValue } = productdiscount;
            const formattedDate = moment(applicableDate).format('YYYY-MM-DD');
            await connection.query(`
                INSERT INTO productdiscounts (productId, discount, applicableDate, userName, thresholdValue, org_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [productId, discount, formattedDate, userName, thresholdValue, org_id]);
        }

        return productId;
    } catch (err) {
        console.error('Error:', err);
        throw err; // Throw the error to handle it in the calling function
    } finally {
        if (connection) {
            // Close the connection
            await connection.end();
        }
    }
}

router.post('/save-discounts', async (req, res) => {
    try {
        const productId = await createProductDiscounts(req.body);
        res.status(201).json({ success: true, productId });
    } catch (error) {
        console.error('Error creating ProductSellingPrice:', error);
        res.status(500).json({ success: false, message: 'Error creating ProductSellingPrice' });
    }
});

module.exports = router;
