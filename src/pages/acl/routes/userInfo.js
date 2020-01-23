import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, Card, Tag, Icon, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { getPageQuery } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { CheckableTag } = Tag;

@connect(({ acl }) => ({
  acl,
}))
@Form.create()
class UserInfo extends PureComponent {
  state = {
    editState: {},
    id: '',
    strLength: {},
    cacheTags: [],
    roleOptions: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const params = getPageQuery();
    const { id } = params;
    this.setState({ id });
    dispatch({
      type: 'acl/queryAclUserInfo',
      payload: { id },
    });
    dispatch({
      type: 'acl/queryRoles',
      payload: {},
      callback: roles => {
        const options = [];
        roles.forEach(role => {
          options.push(<Option key={role.id}>{role.title}</Option>);
        });
        this.setState({ roleOptions: options });
      },
    });
  }

  componentWillUnmount() {}

  refreshStrLength = (info, field) => {
    const { strLength } = this.state;
    const nick = info.nick || '';
    if (field) {
      const str = info[field] || '';
      strLength[field] = str.length;
    } else {
      strLength.nick = nick.length;
    }
    const newObj = Object.assign({}, strLength);
    this.setState({ strLength: newObj });
  };

  handleEditEnter = field => {
    const { dispatch, form, acl: model } = this.props;
    const { id } = this.state;
    if (form.getFieldError(field)) return;
    const formData = form.getFieldsValue();
    this.handleCancelEditState(field);
    const payload = { id };
    payload[field] = formData[field];
    !payload.roles && (payload.roles = model.userInfo.roles);
    dispatch({
      type: 'acl/updateAclUserInfo',
      payload,
    });
  };

  handleEditState = itemName => {
    const { editState } = this.state;
    editState[itemName] = true;
    const newObj = Object.assign({}, editState);
    this.setState({ editState: newObj });
  };

  handleCancelEditState = itemName => {
    const { acl: model } = this.props;
    const { editState } = this.state;
    editState[itemName] = false;
    const newObj = Object.assign({}, editState);
    this.setState({ editState: newObj });
    this.refreshStrLength(model.userInfo, itemName);
  };

  handleInputChange = (e, field) => {
    let str = e;
    if (typeof e !== 'string') {
      str = e.target.value;
    }
    const { strLength } = this.state;
    strLength[field] = str.length;
    const newObj = Object.assign({}, strLength);
    this.setState({ strLength: newObj });
  };

  handleTagsChange = value => {
    const { cacheTags } = this.state;
    const option = <Option key={value}>{value}</Option>;
    for (const elem of cacheTags.values()) {
      if (elem.key === option.key) return;
    }
    cacheTags.push(option);
    this.setState({ cacheTags });
  };

  render() {
    const { acl: model, form } = this.props;
    const { getFieldDecorator } = form;
    const { editState, id, strLength, cacheTags, roleOptions } = this.state;
    const { userInfo, roles: roleData } = model;
    const nick = userInfo.nick || '未设置';
    const tags = (userInfo.tags && userInfo.tags.length && userInfo.tags) || '';
    const roles = (userInfo.roles && userInfo.roles.length && userInfo.roles) || '';
    const roleNames = [];
    if (roles) {
      roles.forEach(id => {
        roleData.forEach(role => {
          if (role.id === id) {
            roleNames.push(role.title);
          }
        });
      });
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <PageHeaderWrapper title="用户详情">
        <Card bordered={false}>
          <Form hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  用户ID
                  <em className={styles.optional}>
                    <Tooltip title="用户ID是由系统自动生成不能手动修改">
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              <span className="ant-form-text">{id}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="昵称">
              {!editState.nick ? (
                <Tooltip title="点击可编辑">
                  <span
                    className="ant-form-text"
                    style={{ whiteSpace: 'pre' }}
                    onClick={() => this.handleEditState('nick')}
                  >
                    {nick}
                  </span>
                </Tooltip>
              ) : (
                <span>
                  {getFieldDecorator('nick', {
                    rules: [
                      { max: 50, message: '不能超过最大字符数' },
                      { whitespace: true, message: '不能输入纯空格字符' },
                    ],
                    initialValue: nick || '',
                  })(
                    <Input
                      style={{ paddingRight: '50px' }}
                      maxLength="50"
                      placeholder="请输入昵称"
                      onChange={value => this.handleInputChange(value, 'nick')}
                    />,
                  )}
                  <span style={{ position: 'absolute', right: 10 }}>
                    {strLength.nick || 0}/50
                    <span style={{ position: 'absolute', width: '150px', marginLeft: 20 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => this.handleEditEnter('nick')}
                      >
                        确定
                      </Button>
                      <Button
                        style={{ marginLeft: 15 }}
                        onClick={() => this.handleCancelEditState('nick')}
                      >
                        取消
                      </Button>
                    </span>
                  </span>
                </span>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="标签">
              {!editState.tags ? (
                <Tooltip title="点击可编辑">
                  <span className="ant-form-text" onClick={() => this.handleEditState('tags')}>
                    {typeof tags === 'string'
                      ? '未设置'
                      : tags.map((item, index) => (
                          <CheckableTag key={index} style={{ borderColor: '#d9d9d9' }}>
                            {item}
                          </CheckableTag>
                        ))}
                  </span>
                </Tooltip>
              ) : (
                <span>
                  {getFieldDecorator('tags', {
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (!value) return callback();
                          if (value.length > 10) {
                            rule.message = '标签数量不得超过10个';
                            return callback(false);
                          }
                          let v = value[value.length - 1];
                          if (!v) return callback();
                          v = v.trim();
                          if (!v.length) return callback('不能输入纯空格字符');
                          if (v.length > 20) return callback('每个标签不得超过20个字');
                          callback();
                        },
                      },
                    ],
                    initialValue: tags || [],
                  })(
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="请输入用户标签"
                      onSelect={this.handleTagsChange}
                    >
                      {cacheTags}
                    </Select>,
                  )}
                  <span style={{ position: 'absolute', width: '150px', marginLeft: 10 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => this.handleEditEnter('tags')}
                    >
                      确定
                    </Button>
                    <Button
                      style={{ marginLeft: 15 }}
                      onClick={() => this.handleCancelEditState('tags')}
                    >
                      取消
                    </Button>
                  </span>
                </span>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="角色">
              {!editState.roles ? (
                <Tooltip title="点击可编辑">
                  <span className="ant-form-text" onClick={() => this.handleEditState('roles')}>
                    {typeof roles === 'string'
                      ? '未设置'
                      : roleNames.map((item, index) => (
                          <CheckableTag key={index} style={{ borderColor: '#d9d9d9' }}>
                            {item}
                          </CheckableTag>
                        ))}
                  </span>
                </Tooltip>
              ) : (
                <span>
                  {getFieldDecorator('roles', {
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (!value) return callback();
                          if (value.length > 5) {
                            rule.message = '标签数量不得超过10个';
                            return callback(false);
                          }
                          let v = value[value.length - 1];
                          if (!v) return callback();
                          v = v.trim();
                          if (!v.length) return callback('不能输入纯空格字符');
                          if (v.length > 20) return callback('每个标签不得超过20个字');
                          callback();
                        },
                      },
                    ],
                    initialValue: roles || [],
                  })(
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="请选择角色"
                      onSelect={this.handleRolesChange}
                    >
                      {roleOptions}
                    </Select>,
                  )}
                  <span style={{ position: 'absolute', width: '150px', marginLeft: 10 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => this.handleEditEnter('roles')}
                    >
                      确定
                    </Button>
                    <Button
                      style={{ marginLeft: 15 }}
                      onClick={() => this.handleCancelEditState('roles')}
                    >
                      取消
                    </Button>
                  </span>
                </span>
              )}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserInfo;
