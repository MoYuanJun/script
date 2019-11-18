import _ from 'lodash';
import React, { Fragment } from 'react';
import { connect } from "react-redux";
import {
    Radio, Modal, Button, Form, Row, Col, 
    InputNumber, Input, message, Select 
} from 'antd';

import LineTitle from "../../../components/lineTitle";
import asyncManage from "./mock/asyncManage";

const MODAL_CODE = 'MODAL_DEMO_CODE';

// Form.Item 布局
const formItemLayout = {
    labelCol: { span: 8},
    wrapperCol: { span: 16},
};

class SearchContainer extends React.Component {
    state = {
        typeList: [],               // 类型列表(用于渲染下拉菜单)
    };

    // 查询
    onSearch = () => {
        const values = this.props.form.getFieldsValue();
        this.props.getData({ ...values, current: 1 });
    }

    // 重置
    onReset = () => {
        this.props.form.resetFields();
    }

    // 获取类型列表数据
    getTypeList = async () => {
        const res = await asyncManage.api_typeList();
        if (res.code !== 200){return false;}
        this.setState({ typeList: _.get(res, 'data.objects') || [] });
    }

    componentDidMount(){
        this.getTypeList();
    }

    render (){
        return (
            <Fragment>
                <LineTitle title="数据查询"/>
                <Form className="search-form">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item label="数据名称" {...formItemLayout}>
                                {this.props.form.getFieldDecorator('name', {
                                    initialValue: void 0,
                                })(<Input placeholder="填写数据名称"/>)}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="数据类型" {...formItemLayout}>
                                {this.props.form.getFieldDecorator('type', {
                                    initialValue: void 0,
                                })(
                                    <Select 
                                        mode="multiple" 
                                        style={{ width: '100%' }} 
                                        placeholder="选择数据类型">
                                        {this.options.type}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="数值" {...formItemLayout}>
                                {this.props.form.getFieldDecorator('num', {
                                    initialValue: void 0,
                                })(
                                    <InputNumber 
                                        style={{ width: '100%' }} 
                                        placeholder="填写数字"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item>
                                <Button icon="search" type="primary" onClick={this.onSearch}>查询</Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Button icon="reload" onClick={this.onReset}>重置</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        );
    }

    // 下拉项
    get options(){
        return {
            type: this.state.typeList.map(v => (
                <Select.Option key={v.id} value={v.id}>
                    {v.name}
                </Select.Option>
            )),
        };
    }
}

SearchContainer = Form.create()(SearchContainer);

export default SearchContainer;
