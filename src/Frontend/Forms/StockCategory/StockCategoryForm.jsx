import React from 'react';
import { Form, Input, Button, Select, Divider } from 'antd';

const { Option } = Select;

const StockCategoryForm = () => {
  const onFinish = (values) => {
    console.log('Form Values:', values);
    // Handle form submission logic
  };

  return (
    <div className="stock-category-form">
      <h4>Stock Category Creation</h4>
      <Divider />

      <Form
        name="stock_category_creation"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: '600px' }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Alias"
          name="alias"
          rules={[{ required: true, message: 'Please input the alias!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Under"
          name="under"
          rules={[{ required: true, message: 'Please select the stock category!' }]}
        >
          <Select placeholder="Select stock category">
            {/* Populate this dropdown with available stock groups */}
            <Option value="stockCategory1">Stock Category 1</Option>
            <Option value="stockCategory2">Stock Category 2</Option>
            <Option value="stockCategory3">Stock Category 3</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StockCategoryForm;
