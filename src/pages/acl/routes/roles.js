import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Col,
  Row,
  Button,
  Icon,
  Input,
  Form,
  Modal,
  Switch,
  Tree,
  Checkbox,
  Tooltip,
  Select,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import classNames from 'classnames';
import find from 'lodash/find';
import uniq from 'lodash/uniq';
import styles from './index.less';

const FormItem = Form.Item;
const { confirm } = Modal;
const { TreeNode } = Tree;
const { Option } = Select;

@connect(({ acl, loading }) => ({
  acl,
  loading: loading.effects['acl/queryAclUserPerRoles'],
  resLoading: loading.effects['acl/queryResources'],
}))
@Form.create()
class Roles extends PureComponent {
  state = {
    height: `${document.body.clientHeight - 360}px`,
    itemIndex: -1,
    isCollapsed: true,
    editStatus: -1,
    roleOptions: [],
    targetRole: {},
    resourcePer: {},

    expandedKeys: [],
    autoExpandParent: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    window.addEventListener('resize', this.resizeHeight);
    this.queryAclUserPerRoles();
    dispatch({
      type: 'acl/queryResources',
      payload: {},
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHeight);
  }

  resizeHeight = () => {
    this.setState({ height: `${document.body.clientHeight - 360}px` });
  };

  queryAclUserPerRoles = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'acl/queryAclUserPerRoles',
      payload: {},
      callback: roles => {
        const options = [];
        roles.forEach(role => {
          options.push(<Option key={role.id}>{role.title}</Option>);
        });
        this.setState({ roleOptions: options });
      },
    });
  };

  handleItemClick = (item, index) => {
    const { dispatch } = this.props;
    const { itemIndex } = this.state;
    if (itemIndex === index) return;
    dispatch({
      type: 'acl/queryAclResourcePer',
      payload: { role: item.id },
      callback: resourcePer => {
        this.setState({
          itemIndex: index,
          targetRole: item,
          resourcePer,
        });
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const self = this;
    const { form, dispatch } = this.props;
    const { editStatus, targetRole } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let type = 'acl/addAclRole';
        const update = { isCollapsed: true, editStatus: -1, itemIndex: -1 };
        if (editStatus === 2) {
          values.id = targetRole.id;
          type = 'acl/updateAclRole';
          delete update.itemIndex;
        }
        values.status === true ? (values.status = 1) : (values.status = 0);

        dispatch({
          type,
          payload: values,
          callback: doc => {
            self.setState({ targetRole: doc, ...update });
            self.queryAclUserPerRoles();
          },
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({ isCollapsed: true, editStatus: -1 });
  };

  handleAdd = () => {
    let { isCollapsed } = this.state;
    isCollapsed = !isCollapsed;
    let editStatus = -1;
    isCollapsed ? (editStatus = -1) : (editStatus = 1);
    this.setState({ isCollapsed, editStatus });
  };

  handleUpdate = () => {
    let { isCollapsed } = this.state;
    isCollapsed = !isCollapsed;
    let editStatus = -1;
    isCollapsed ? (editStatus = -1) : (editStatus = 2);
    this.setState({ isCollapsed, editStatus });
  };

  updateRoleResourcePer(parent = {}, per, flag, ary, count = 0) {
    parent.id = ary[count];
    const nextId = ary[++count];
    if (nextId) {
      let resource = {};
      if (parent.children) {
        resource = find(parent.children, { id: nextId });
        !resource && (resource = {}) && parent.children.push(resource);
      } else {
        parent.children = [resource];
      }
      this.updateRoleResourcePer(resource, per, flag, ary, count);
    } else {
      parent.permissions || (parent.permissions = []);
      if (flag) {
        parent.permissions.push(per);
      } else {
        const index = parent.permissions.indexOf(per);
        index >= 0 && parent.permissions.splice(index, 1);
        !parent.permissions.length && delete parent.permissions;
      }
    }
  }

  changePermisssion = (e, item, path, type) => {
    const { targetRole, itemIndex } = this.state;
    let { resourcePer } = this.state;
    if (itemIndex === -1) return;

    const { checked } = e.target;

    targetRole.resources || (targetRole.resources = []);
    let res = [];
    if (path === '/') {
      res = ['/'];
    } else if (path[0] !== '/') {
      res = path
        .split('/')
        .filter(item => !!item)
        .map((item, index) => {
          if (index === 0) return item;
          return `/${item}`;
        });
    } else {
      res = path
        .split('/')
        .filter(item => !!item)
        .map(item => `/${item}`);
    }
    let targetRoot = find(targetRole.resources, { id: res[0] });
    if (!targetRoot) {
      targetRoot = {};
      targetRole.resources.push(targetRoot);
    }
    this.updateRoleResourcePer(targetRoot, type, checked, res);

    resourcePer[path] || (resourcePer[path] = []);
    if (checked) {
      resourcePer[path].push(type);
      resourcePer[path] = uniq(resourcePer[path]);
    } else {
      resourcePer[path].splice(resourcePer[path].indexOf(type), 1);
    }
    resourcePer = Object.assign({}, resourcePer);
    this.setState({ resourcePer });
  };

  handleSave = () => {
    const self = this;
    const { dispatch } = this.props;
    const { targetRole } = this.state;

    dispatch({
      type: 'acl/updateAclRole',
      payload: targetRole,
      callback: () => {
        self.queryAclUserPerRoles();
      },
    });
  };

  handleDelete = item => {
    const self = this;
    const { dispatch } = this.props;
    const { targetRole } = this.state;
    const update = { itemIndex: -1 };
    if (targetRole.id === item.id) {
      update.targetRole = {};
    }
    dispatch({
      type: 'acl/removeAclRole',
      payload: { id: item.id },
      callback: () => {
        self.setState(update);
        self.queryAclUserPerRoles();
      },
    });
  };

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: true,
    });
  };

  render() {
    // const height = `calc(${this.state.height} - 20px)`;
    const {
      expandedKeys,
      autoExpandParent,
      itemIndex,
      isCollapsed,
      editStatus,
      roleOptions,
      targetRole,
      resourcePer,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { loading, resLoading, acl: model } = this.props;
    const { perRoles, userRoles, resources } = model;
    let curRole = {};
    if (editStatus === 2) {
      curRole = targetRole;
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 14 },
      },
    };

    const itemButtonGroup = (
      <span>
        {editStatus !== 2 && (
          <Button
            type={isCollapsed ? 'primary' : 'default'}
            size="small"
            style={{ marginLeft: 4 }}
            onClick={() => this.handleAdd()}
          >
            {isCollapsed ? '新增' : '取消'}
          </Button>
        )}
        {itemIndex !== -1 && editStatus !== 1 && (
          <Button
            size="small"
            style={{
              marginLeft: 3,
              color: '#fff',
              backgroundColor: '#27c24c',
              borderColor: '#27c24c',
            }}
            onClick={() => this.handleUpdate()}
          >
            {isCollapsed ? '编辑' : '取消'}
          </Button>
        )}
      </span>
    );

    const leftTitle = (
      <span>
        <Form layout="inline">
          <Row type="flex" justify="start">
            <Col md={10} sm={24}>
              <FormItem label="角色">
                <Input size="small" value={targetRole.title || '角色'} disabled />
              </FormItem>
            </Col>
            <Col md={10} sm={24}>
              <FormItem label="描述">
                <Input size="small" value={targetRole.description || '描述'} disabled />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </span>
    );

    const rightExtra = (
      <span>
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: 3 }}
          onClick={() => this.handleSave()}
        >
          保存
        </Button>
      </span>
    );

    const self = this;

    function showConfirm(item) {
      confirm({
        title: '提示',
        content: '是否确定删除?',
        onOk() {
          self.handleDelete(item);
        },
        onCancel() {},
      });
    }

    const loop = (data, prefix = '') =>
      data.map(item => {
        const path = prefix + item.id;
        const permissions = item.permissions || [];
        const per = (itemIndex !== -1 && resourcePer[path]) || [];
        const title = (
          <span>
            <Tooltip title={path} key={path}>
              {item.title}
            </Tooltip>
            <div className={styles.pullRight}>
              <span style={{ marginRight: 44, width: 16, display: 'inline-block' }}>
                {permissions.indexOf('post') > -1 && (
                  <Checkbox
                    checked={per.indexOf('post') > -1}
                    onChange={e => this.changePermisssion(e, item, path, 'post')}
                  />
                )}
              </span>
              <span style={{ marginRight: 42, width: 16, display: 'inline-block' }}>
                {permissions.indexOf('put') > -1 && (
                  <Checkbox
                    checked={per.indexOf('put') > -1}
                    onChange={e => this.changePermisssion(e, item, path, 'put')}
                  />
                )}
              </span>
              <span style={{ marginRight: 40, width: 16, display: 'inline-block' }}>
                {permissions.indexOf('delete') > -1 && (
                  <Checkbox
                    checked={per.indexOf('delete') > -1}
                    onChange={e => this.changePermisssion(e, item, path, 'delete')}
                  />
                )}
              </span>
              <span style={{ marginRight: 15, width: 16, display: 'inline-block' }}>
                {permissions.indexOf('get') > -1 && (
                  <Checkbox
                    checked={per.indexOf('get') > -1}
                    onChange={e => this.changePermisssion(e, item, path, 'get')}
                  />
                )}
              </span>
            </div>
          </span>
        );
        if (item.children) {
          return (
            <TreeNode
              key={path}
              title={title}
              className={styles.bottomborder}
              selectable={false}
              style={{ padding: 0 }}
            >
              {loop(item.children, path)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.id}
            title={title}
            className={styles.bottomborder}
            selectable={false}
            style={{ padding: 0 }}
          />
        );
      });

    return (
      <PageHeaderWrapper title="角色管理">
        <Card bodyStyle={{ padding: 0 }}>
          <Row style={{ top: '-10px' }}>
            <Col xl={6} lg={24} md={24} sm={24} xs={24} style={{ marginTop: '10px' }}>
              <Card
                loading={loading}
                title="角色"
                extra={itemButtonGroup}
                bordered={false}
                style={{ borderRight: '1px solid #E4EAEC' }}
                bodyStyle={{ padding: 0, height: '100%' }}
              >
                {!this.state.isCollapsed && (
                  <Form
                    onSubmit={this.handleSubmit}
                    hideRequiredMark
                    style={{ padding: '10px 15px', backgroundColor: '#fafafa' }}
                  >
                    <FormItem {...formItemLayout} label="上级">
                      {getFieldDecorator('parents', {
                        rules: [],
                        initialValue: curRole.parents || [],
                      })(
                        <Select mode="multiple" placeholder="上级角色">
                          {roleOptions}
                        </Select>,
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="编码">
                      {getFieldDecorator('id', {
                        rules: [
                          {
                            required: true,
                            message: '请输入编码',
                          },
                        ],
                        initialValue: curRole.id || '',
                      })(<Input placeholder="编码(a-z|A-Z|0-9字符)" />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名称">
                      {getFieldDecorator('title', {
                        rules: [
                          {
                            required: true,
                            message: '请输入名称',
                          },
                        ],
                        initialValue: curRole.title || '',
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
                        initialValue: curRole.description || '',
                      })(<Input placeholder="描述" />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="开/关">
                      {getFieldDecorator('status', {
                        rules: [],
                        initialValue: curRole.status === 1,
                      })(
                        <Switch
                          checkedChildren="开"
                          unCheckedChildren="关"
                          defaultChecked={curRole.status === 1}
                        />,
                      )}
                    </FormItem>
                    <FormItem
                      wrapperCol={{ xs: { span: 14, offset: 8 }, sm: { span: 14, offset: 8 } }}
                      style={{ marginTop: 25 }}
                    >
                      <Button type="primary" htmlType="submit">
                        保存
                      </Button>
                      <Button onClick={() => this.handleCancel()} style={{ marginLeft: 8 }}>
                        取消
                      </Button>
                    </FormItem>
                  </Form>
                )}

                <div className={styles.scrollYHidden} style={{ height: this.state.height }}>
                  <div style={{ height: this.state.height }}>
                    <div className={styles.listGroup}>
                      {perRoles.map((item, index) => (
                        <Tooltip title={`${item.id}:${item.description}`} key={item.id}>
                          <a
                            className={classNames(styles.listGroupItem, {
                              [styles.selected]: index === this.state.itemIndex,
                            })}
                            key={item.id}
                            onClick={() => {
                              this.handleItemClick(item, index);
                            }}
                          >
                            {!userRoles[item.id] && isCollapsed && (
                              <Icon
                                type="close"
                                key="Icon"
                                className={styles.hoverAction}
                                onClick={() => {
                                  showConfirm(item);
                                }}
                              />
                            )}
                            {item.title}
                          </a>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginTop: '10px' }}>
              <Card
                loading={resLoading}
                title={leftTitle}
                extra={rightExtra}
                bordered={false}
                style={{ borderLeft: '1px solid #E4EAEC' }}
                bodyStyle={{ padding: 0 }}
                className={styles.headTitle}
              >
                <div style={{ paddingLeft: 0, backgroundColor: '#f6f6f6' }}>
                  <span className={styles.listGroupItem} onClick={() => {}}>
                    资源
                    <div className={styles.pullRight}>
                      <Tooltip title="POST">
                        <span style={{ marginRight: 30 }}>新增</span>
                      </Tooltip>
                      <Tooltip title="PUT">
                        <span style={{ marginRight: 30 }}>修改</span>
                      </Tooltip>
                      <Tooltip title="DELETE">
                        <span style={{ marginRight: 30 }}>删除</span>
                      </Tooltip>
                      <Tooltip title="GET">
                        <span>查询</span>
                      </Tooltip>
                    </div>
                  </span>
                </div>
                <div className={styles.scrollYHidden} style={{ height: this.state.height }}>
                  <div style={{ height: this.state.height, width: '102%', padding: 0 }}>
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
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Roles;
