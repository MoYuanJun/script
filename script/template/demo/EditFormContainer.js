import _ from 'lodash';
import React from 'react';
import { connect } from "react-redux";
import {
    Radio, Modal, Button, Form, Row, Col, 
    InputNumber, Input, message, Select 
} from 'antd';

import LineTitle from "../../../components/lineTitle";

import { closeModalAction } from "../../modules/modalModule";

import asyncManage from "./mock/asyncManage";

const MODAL_CODE = 'MODAL_DEMO_CODE';

// Form.Item 布局
const formItemLayout = {
    // 单行
    single: {
        labelCol: { span: 2},
        wrapperCol: { span: 21},
    },
    // 双栏
    double: {
        labelCol: { span: 4},
        wrapperCol: { span: 18},
    },
};

class EditFormContainer extends React.Component {
    state = {
        detail: null,               // 详情(编辑时存储当前要编辑的数据)
        typeList: [],               // 类型列表(用于渲染下拉菜单)
    };

    // 新增
    add = async (values) => {
        const res = await asyncManage.api_add(values);
        if (res.code === 200){
            message.success('数据添加成功!');
            this.props.getData({ current: 1 });
        }
        this.cancel();
    }

    // 编辑
    edit = async (values) => {
        const id = _.get(this.modal, 'data.id');
        const res = await asyncManage.api_update({ id, ...values});
        if (res.code === 200){
            message.success('数据编辑成功!');
            this.props.getData({ current: 1 });
        }
        this.cancel();       
    }

    // 取消
    cancel = () => {
        this.props.closeModalAction(MODAL_CODE);
        this.props.form.resetFields();
        this.setState({ detail: null, typeList: [] });
    }

    // 保存
    save = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!!err){return false;}
            this[this.modal.data ? 'edit' : 'add'](values);
            this.cancel();
        });
    }

    // 获取 detail 详情
    getDetail = async () => {
        const id = _.get(this.modal, 'data.id');
        if (!id){return false;}
        const res = await asyncManage.api_get({ id });
        if (res.code !== 200){return false;}
        this.setState({ detail: res.data || {} });
    };

    // 获取类型列表数据
    getTypeList = async () => {
        const res = await asyncManage.api_typeList();
        if (res.code !== 200){return false;}
        this.setState({ typeList: _.get(res, 'data.objects') || [] });
    }

    // 每次 modal 打开触发事件
    onOpen = () => {
        this.getTypeList()
        this.getDetail();
    }

    // 处理 modal 状态: 根据 this.modal 进行判断
    handleModalStatus = (preProps) => {
        const currentModal = this.modal;
        const preModal = preProps.modal[MODAL_CODE] || {};
        if (_.isEmpty(currentModal) !== _.isEmpty(preModal)){
            !_.isEmpty(currentModal) && this.onOpen();
        }
    };

    componentDidUpdate(preProps, preState){
        this.handleModalStatus(preProps);
    }

    render (){
        return (
            <Modal
                width={1000}
                footer={this.footer}
                maskClosable={false}
                onCancel={this.cancel}
                title={this.modal.title}
                visible={!_.isEmpty(this.modal)}
            >
                <Form >
                    <Row>
                        <Col span={24}>
                            <Form.Item label="数据名称" {...formItemLayout.single}>
                                {this.props.form.getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请填写数据名称!' }],
                                    initialValue: _.get(this.state, 'detail.name', void 0),
                                })(<Input placeholder="填写数据名称"/>)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="数据类型" {...formItemLayout.double}>
                                {this.props.form.getFieldDecorator('type', {
                                    initialValue: _.get(this.state, 'detail.type', void 0),
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
                        <Col span={12}>
                            <Form.Item label="数值" {...formItemLayout.double}>
                                {this.props.form.getFieldDecorator('num', {
                                    initialValue: _.get(this.state, 'detail.num', void 0),
                                })(
                                    <InputNumber 
                                        style={{ width: '100%' }} 
                                        placeholder="填写数字"
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="状态" {...formItemLayout.double}>
                                {this.props.form.getFieldDecorator('status', {
                                    initialValue: _.get(this.state, 'detail.status', false),
                                })(
                                    <Radio.Group>
                                        <Radio value={true}>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
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

    // 表格数据源: 如果需要在这里对数据进行处理
    get dataSource(){
        return this.state.listData || [];
    }

    // 获取弹窗数据
    get modal(){
        return this.props.modal[MODAL_CODE] || {};
    }

    // 弹窗 footer
    get footer(){
        return [
            <Button key="back" onClick={this.cancel} >取消</Button>,
            <Button key="submit" type="primary" onClick={this.save}>保存</Button>
        ];
    }
}

const mapStateToProps = state => ({
	modal: state.modal,
});

const mapDispatchToProps = {
    closeModalAction,
};

EditFormContainer = connect(mapStateToProps, mapDispatchToProps)(
    EditFormContainer
);

EditFormContainer = Form.create()(EditFormContainer);

export default EditFormContainer;