import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, message, Table, Pagination, Modal } from 'antd';
import { AppContext } from '../../../Context/AppContext';
import Header from '../../components/Header';
import { SearchOutlined } from '@ant-design/icons';
import ProductCostPrice from './ProductCostPrice';
import SellingPriceForm from './ProductSellingPrice';
import DiscountForm from './ProductDiscountForm';

const ProductConfig = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const { companyName } = useContext(AppContext);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredProductsData, setFilteredProductsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (companyName) {
      fetchProducts();
    }
  }, [companyName]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin-products', {
        params: { companyName }
      });
      setProducts(response.data);
      setFilteredProductsData(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products. Please try again.');
    }
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleEdit = (product, type) => {
    setEditingProductId(product.id);
    setSelectedProduct(product);
    setEditingType(type);
    setShowModal(true);
  };

  const handleSave = async (updatedData) => {
    try {
      await axios.post('http://localhost:5000/api/update-product', {
        productId: editingProductId,
        type: editingType,
        data: updatedData
      });
      message.success('Product updated successfully!');
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('Failed to save product. Please try again.');
    }
  };

  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'productName' },
    {
      title: 'Cost Prices',
      key: 'costPrices',
      render: (text, record) => (
        <>
        <Button onClick={() => handleEdit(record, 'costPrices')}>
          Edit
        </Button>

        <Button type="primary" onClick={() => handleView(record, 'costPrices')} style={{ marginLeft: 8, color: 'white' }}>
          View
        </Button>
        </>
      )
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      render: (text, record) => (
        <>
        <Button onClick={() => handleEdit(record, 'sellingPrice')}>
          Edit
        </Button>

        <Button type="primary" onClick={() => handleView(record, 'sellingPrice')} style={{ marginLeft: 8, color: 'white' }}>
          View
        </Button>
        </>
      )
    },
    {
      title: 'Enable Standard Discount',
      dataIndex: 'enableStandardDiscount',
      key: 'enableStandardDiscount',
      render: (text, record) => (
        <>
        <Button onClick={() => handleEdit(record, 'discount')}>
          Edit
        </Button>

        <Button type="primary" onClick={() => handleView(record, 'discount')} style={{ marginLeft: 8, color: 'white' }}>
          View
        </Button>
        </>
      )
    },
  ];

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filteredData = products.filter(product => 
      product.name.toLowerCase().includes(value)
    );
    setFilteredProductsData(filteredData);
    setCurrentPage(1);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const selectedProductTitleStyle = {
    fontWeight: 'bold',
  };

  return (
    <div className='app'>
      <Header />
      <div className="product-main-container">
        <div className="product-table-section">
          <h2>Product Configuration</h2>
          <Input
            placeholder="Search by Product Name"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: 20 }}
          />
          <Table
            dataSource={filteredProductsData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            columns={columns}
            rowKey="productId"
            pagination={false}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredProductsData.length}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['50', '100', '500', '1000', '1500', '2000']}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            style={{ marginTop: 20, textAlign: 'right' }}
          />
        </div>
      </div>

      <Modal
        title={
          <span style={selectedProduct ? selectedProductTitleStyle : {}}>
            Edit {editingType && editingType.charAt(0).toUpperCase() + editingType.slice(1)} - {selectedProduct ? selectedProduct.name : ''}
          </span>
        }
        visible={showModal}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Cancel
          </Button>,
          
        ]}
        destroyOnClose={true}
        width={1000}
        className={selectedProduct ? 'selected-product-modal' : ''}
      >
        {selectedProduct && editingType === 'costPrices' && <ProductCostPrice productId={selectedProduct.id} />}
        {selectedProduct && editingType === 'sellingPrice' && <SellingPriceForm productId={selectedProduct.id} />}
        {selectedProduct && editingType === 'discount' && <DiscountForm productId={selectedProduct.id} />}
      </Modal>
    </div>
  );
};

export default ProductConfig;
