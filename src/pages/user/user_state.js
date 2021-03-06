import React, { Component, PropTypes } from 'react';
import {Link,hashHistory} from 'react-router';
import {Form,Modal } from 'antd';
import Navbar from '../common/navbar';
import Api from '../api';
import { createForm } from 'rc-form';
const confirm = Modal.confirm;
import { Toast } from 'antd-mobile';
import 'antd-mobile/lib/toast/style/css';//加载选择样式

export default class User_state extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text:"",
      nick_name:"",
      mobile:"",
      real_name:"",
      card_num:"",
      isset_secpwd:"",
      visible: false,
      bank_name:'',
      bank_bank_username:''

    };
  }
  componentWillMount(){
    if(!sessionStorage.getItem("user")){
      hashHistory.push("login");
    };
    Api("c=user&a=info",null,(res)=>{
      let data=res.data;
      this.setState({
        nick_name:data.nick_name,
        mobile:data.mobile,
        real_name:data.real_name,
        card_num:data.card_num,
        isset_secpwd:data.isset_secpwd,
        bank_name:data.bank_name,
        bank_bank_username:data.bank_bank_username,
        username:data.username
      })
    });
  }

  //设置信息
  //param:字段名
  setUserInfo(param){
    switch(param){
      case "nick_name":
        hashHistory.push("setUserInfo?param="+param);
        break;
      case "mobile":
        if(this.state.mobile){
          return false;
        }else{
          hashHistory.push("setUserInfo?param="+param);
        }
        break;
      case "real_name":
        if(this.state.real_name){
          return false;
        }else{
          hashHistory.push("setUserInfo?param="+param);
        }
        break;
      case "card_num":
        if(this.state.card_num){
          this.showModal();
          return false;
        }else{
          hashHistory.push("bankCardBind");
        }
        break;

      case "isset_secpwd":
        if(this.state.isset_secpwd){
          hashHistory.push("setpassword");
        }else{
          hashHistory.push("setpassword");
        }
        break;
    }
  }

  showConfirm() {   //警告弹窗
    confirm({
      title: '提示',
      content: '您确定要退出登陆？',
      onOk() {
        Api("c=user&a=loginout",{str:3,is_wap:1},function(){
          sessionStorage.removeItem("user");
          setTimeout(()=>{
            hashHistory.push("Home");
          },100)
        })
      },
      onCancel() {
      },
    });
  }
  //	银行卡信息
  showModal() {
    this.setState({
      visible: true,
    });

  }
  handleOk () {
    this.setState({
      visible: false,
    });

  };

  render() {
    return (

			<Form>
				<Navbar back="/user_login"  title="个人信息"/>
				<div className="user-info-wrap">
					<div className="user-info-self">
						<h3>个人</h3>
						<ul>
							<li className="avatar-wrap">
								<i className="icon-avatar"></i>

							</li>
							<li onClick={()=>{this.setUserInfo("nick_name")}}>
								<span>昵称</span>
								<label>{this.state.nick_name}</label>
								<i className="anticon anticon-right"></i>
							</li>
						</ul>
						<h3>账户安全</h3>
						<ul>
							<li className=""  >
								<span >用户名</span>
								<label>{this.state.username}</label>
							</li>
							<li className={this.state.mobile?"hide-antion":""}  onClick={()=>{this.setUserInfo("mobile")}}>
								<span >手机号码</span>
								<label>{this.state.mobile}</label>
								<i className="anticon anticon-right"></i>
							</li>
							<li  className={this.state.real_name?"hide-antion":""}  onClick={()=>{this.setUserInfo("real_name")}}>
								<span >真实姓名</span>
								<label >{this.state.real_name}</label>
								<i className="anticon anticon-right"></i>
							</li>
							<li className={this.state.card_num?"hide-antion":""} onClick={()=>{this.setUserInfo("card_num")}}>
								<span >绑定银行卡</span>
								<label >{this.state.card_num}</label>
								<i className="anticon anticon-right"></i>
							</li>
							<li  onClick={()=>{this.setUserInfo("isset_secpwd")}}>
								<span >资金密码</span>
								<label >{this.state.isset_secpwd===1?"点击修改资金密码":"点击修改资金密码"}</label>
								<i className="anticon anticon-right"></i>
							</li>
							<Link to="resetLoginPsd">
								<li >
									<span >修改登陆密码</span>
									<label>点击修改登陆密码</label>
									<i className="anticon anticon-right"></i>
								</li>
							</Link>
						</ul>
						<button className="exit-btn" onClick={this.showConfirm.bind(this)}>安全退出账号</button>


					</div>
					<Modal
						wrapClassName="showcard-wrapper"
						closable={false}
						title="提示"
						visible={this.state.visible}
						footer={null}
					>
						<div className="x-confirm-data">
							<p>银行:{this.state.bank_name}</p>
							<p>卡主:{this.state.bank_bank_username}</p>
							<p>卡号:{this.state.card_num}</p>
							<p className="tips">
								提示:修改银行卡信息请与客服联系
							</p>
						</div>
						<div className="x-btn-wrapper">
							<span onClick={()=>{this.handleOk()}}>确定</span>
						</div>
					</Modal>
				</div>
			</Form>


    );

  }
}
// (this.name:"修改昵称")(this.name:"修改手机号码",this.title:"注意：如需要修改手机号码请联系客服")(this.name:"修改真实姓名")
