import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Button, Input, Form, Modal, Tree, Checkbox, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TreeNode } = Tree;
const { Option } = Select;

@connect(({ acl, loading }) => ({
  acl,
  loading: loading.effects['acl/queryResources'],
}))
@Form.create()
class Resources extends PureComponent {
  state = {
    height: `${document.body.clientHeight - 100}px`,
    isNew: false,
    resources: [],
    targetResource: null,
    parentResource: null,

    expandedKeys: [],
    autoExpandParent: true,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeHeight);
    this.queryResources();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHeight);
  }

  resizeHeight = () => {
    this.setState({ height: `${document.body.clientHeight - 100}px` });
  };

  queryResources = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'acl/queryResources',
      payload: {},
      callback: rows => {
        this.setState({ resources: rows });
      },
    });
  };

  handleItemClick = (item, parent) => {
    const { targetResource } = this.state;
    if (targetResource === item) {
      item = null;
      parent = null;
    }
    this.setState({ targetResource: item, parentResource: parent, isNew: false });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { isNew, parentResource, resources } = this.state;
    let { targetResource } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        form.resetFields();
        console.log(parentResource);
        console.log(values);
        targetResource || (targetResource = {});
        Object.assign(targetResource, values);
        if (isNew) {
          if (parentResource) {
            parentResource.children || (parentResource.children = []);
            parentResource.children.push(targetResource);
          } else {
            resources.push(targetResource);
          }
        }
        console.log(resources);
        dispatch({
          type: 'acl/saveResources',
          payload: resources,
          callback: () => {
            // console.log(doc)
            this.setState({ targetResource: null });
            this.queryResources();
          },
        });
      }
    });
  };

  handleAdd = () => {
    let { isNew, targetResource, parentResource } = this.state;
    isNew = !isNew;
    if (isNew) {
      parentResource = targetResource;
      targetResource = null;
    } else {
      targetResource = parentResource;
      parentResource = null;
    }
    this.setState({ isNew, parentResource, targetResource });
  };

  handleDelete = () => {
    const self = this;
    const { dispatch } = this.props;
    const { targetResource, parentResource, resources } = this.state;
    confirm({
      title: '提示',
      content: '是否确定删除?',
      onOk() {
        const v = parentResource ? parentResource.children : resources;
        const idx = v.indexOf(targetResource);
        v.splice(idx, 1);
        console.log(resources);
        dispatch({
          type: 'acl/saveResources',
          payload: resources,
          callback: () => {
            self.setState({ targetResource: null });
            self.queryResources();
          },
        });
      },
      onCancel() {},
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: true,
    });
  };

  render() {
    const { expandedKeys, autoExpandParent, resources, targetResource, isNew } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    const noTarget = !targetResource;
    console.log('noTarget', noTarget, 'targetResource', targetResource);
    const { id, title, description, permissions, noRecursion } = targetResource || {};

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
        md: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },
    };

    const btnTitle = noTarget ? '新增顶级资源' : '新增下级资源';

    const itemButtonGroup = (
      <span>
        <Button type={!isNew ? 'primary' : 'default'} size="small" onClick={() => this.handleAdd()}>
          {!isNew ? btnTitle : '取消'}
        </Button>
      </span>
    );

    const loop = (rows, parent, prefix = '') =>
      rows.map(item => {
        const path = prefix + item.id;
        const title = <span onClick={() => this.handleItemClick(item, parent)}>{item.title}</span>;
        if (item.children) {
          return (
            <TreeNode key={path} title={title}>
              {loop(item.children, item, path)}
            </TreeNode>
          );
        }
        return <TreeNode key={path} title={title} />;
      });

    return (
      <PageHeaderWrapper title="资源管理">
        <Card bodyStyle={{ padding: 0 }}>
          <Row style={{ top: '-10px' }}>
            <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginTop: '10px' }}>
              <Card
                loading={loading}
                title="资源"
                extra={itemButtonGroup}
                bordered
                style={{ borderRight: '1px solid #E4EAEC' }}
                bodyStyle={{ padding: 0, height: '100%' }}
              >
                <div className={styles.scrollYHidden} style={{ height: this.state.height }}>
                  <div style={{ height: this.state.height, padding: 0 }}>
                    <Tree
                      onExpand={this.onExpand}
                      expandedKeys={expandedKeys}
                      autoExpandParent={autoExpandParent}
                    >
                      {loop(resources)}
                    </Tree>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginTop: '10px' }}>
              <Card title="编辑资源" bordered={false} style={{ borderLeft: '1px solid #E4EAEC' }}>
                <Form onSubmit={this.handleSubmit}>
                  <FormItem {...formItemLayout} label="编码">
                    {getFieldDecorator('id', {
                      rules: [
                        {
                          required: true,
                          message: '请输入编码',
                        },
                      ],
                      initialValue: id || '',
                    })(
                      <Input
                        placeholder="编码(a-z|A-Z|0-9字符)"
                        disabled={!targetResource && !isNew}
                      />,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="名称">
                    {getFieldDecorator('title', {
                      rules: [
                        {
                          required: true,
                          message: '请输入名称',
                        },
                      ],
                      initialValue: title || '',
                    })(<Input placeholder="名称" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="描述">
                    {getFieldDecorator('description', {
                      rules: [
                        {
                          required: false,
                          message: '请输入描述',
                        },
                      ],
                      initialValue: description || '',
                    })(<Input placeholder="描述" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="权限">
                    {getFieldDecorator('permissions', {
                      rules: [
                        {
                          required: true,
                          message: '请选择权限',
                        },
                      ],
                      initialValue: permissions || [],
                    })(
                      <Select mode="multiple" placeholder="请选择权限">
                        <Option key="*">*</Option>
                        <Option key="post">增</Option>
                        <Option key="put">改</Option>
                        <Option key="delete">删</Option>
                        <Option key="get">查</Option>
                      </Select>,
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="禁止传递权限">
                    {getFieldDecorator('noRecursion', {
                      valuePropName: 'checked',
                      initialValue: noRecursion || false,
                    })(<Checkbox />)}
                  </FormItem>

                  {(isNew || targetResource) && (
                    <FormItem
                      wrapperCol={{ xs: { span: 14, offset: 8 }, sm: { span: 14, offset: 8 } }}
                      style={{ marginTop: 25 }}
                    >
                      <Button type="primary" htmlType="submit">
                        {isNew ? '创建' : '更新'}
                      </Button>
                      {!isNew && (
                        <Button onClick={() => this.handleDelete()} style={{ marginLeft: 8 }}>
                          删除
                        </Button>
                      )}
                    </FormItem>
                  )}
                </Form>
              </Card>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Resources;
