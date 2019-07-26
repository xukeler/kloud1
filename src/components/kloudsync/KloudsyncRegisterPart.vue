<template>
  <div v-if="isOrganizationPage">
    <div class="kloudSync-organization-page" v-if="companieApplayArray.length==0">
      <div class="middle-space">
        <div class="logo" >
          <img src="../../../static/images/kloudsyncLogo.png" width="40" height="40"/>
          <p>KloudSync</p>
          <p style="margin:20px 0px;"><img src="../../../static/images/kloudsync-welcome.png" width="200" height="200"/></p>
        </div>
        <!--公司邀请提示 先隐藏-->
        <div v-show="companieApplayArray.length!=0" style="margin: auto;width:360px;background-color: #f8f8f9;;color: #2d8cf0;border-radius: 5px;cursor: pointer;
        display:flex;justify-content:center;
        flex-direction: row;margin-bottom:20px;">
          <div style="flex:0 0 20px;padding-top:5px;">
            <Icon type="alert" color="#2d8cf0" size="25"></Icon>
          </div>
          <div style="flex:1 1 120px">{{$t('KloudSyncRegister.ThereAre') + companieApplayArray.length+$t('KloudSyncRegister.ConfirmInvitation')}}</div>
        </div>
        <div class="head-info">
          <p class="head-info-first">{{$t('KloudSyncRegister.WelcomeUser')}}</p>
          <p class="head-info-second">{{$t('KloudSyncRegister.JoinNewOrganization')}}</p>
          <p class="head-info-second">{{$t('KloudSyncRegister.SetNewOrganization')}}</p>
        </div>
        <div class="action-sapce">
          <p style="margin-top:20px;"><Button type="success" shape="circle" style="width:200px;" @click="showCreateOrganization">{{$t('KloudSyncRegister.CreateNew')}}</Button></p>
          <p style="margin-top:30px;font-size: 13px;">{{$t('KloudSyncRegister.JoinMeeting')}}</p>
          <p style="margin-top:20px;"><Button type="primary" shape="circle" style="width:200px;" @click="showJoinOrganization">{{$t('KloudSyncRegister.JoinMeeting')}}</Button></p>
        </div>
      </div>

      <Modal v-model="joinOrganization" title="Join meeting" :closable="false" :mask-closable="false"  width="400" style="z-index:2000;position: absolute;">
        <div class="action-sapce" style="height:200px;overflow-y:auto;word-wrap: break-word;word-break: normal;">
          <p style="padding-top:30px">
            <Input v-model="meetingRoomId" placeholder="Input Meeting room ID..."/>
          </p>
          <!-- <p style="margin-top:15px;"><Checkbox v-model="acceptRequestToChat">Accept request to chat from tieren</Checkbox></p> -->
          <p style="color:red;font-size: 13px;margin-top:15px;" v-show="inviteCodeError">{{errorMessage+ $t('KloudSyncRegister.CheckAndTry')}}</p>
        </div>
        <div slot="footer" style="height:35px;">
          <Button type="primary"  @click="handleJoin">{{$t('KloudSyncRegister.JoinNow')}}</Button>
          <Button style="float:left" @click="handJoinCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
      <Modal v-model="createOrganization" title="Create account" :closable="false" :mask-closable="false"  width="500" style="z-index:2000;position: absolute;">
        <div class="action-sapce">
          <div style="margin-top:20px;text-align:center;">
            <p>{{$t('KloudSyncRegister.OrganizationLogo')}}</p>
            <p style="margin-top:10px;display: flex;justify-content: center;align-items: center;">
              <Upload 
                ref="uploadCreateCompany" 
                type="drag" 
                :headers="uploadCompanyFileHeaders" 
                :before-upload="handleUpload" 
                :action="uploadCreateCompanyUrl" 
                :default-file-list="defaultList"
                :on-success="uploadSucess"
                style="width:150px" 
                accept="image/jpg,image/jpeg,image/png" 
                :format="['jpg','jpeg','png']">
                <div style="padding: 20px 10px;" v-show="!uploadCompanyFile">
                  <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                  <p>{{$t('UploadFileWithTag.ClickUpload')}}</p>
                </div>
                <div style="padding: 20px 10px;" v-show="uploadCompanyFile">
                  <img :src="uploadCompanyFilePriview" style="width: 100%">
                </div>
              </Upload>
            </p>
          </div>
          <Form ref="organizationInfo" :model="organizationInfo" :rules="organizationInfoRuleInline" style="margin: auto;width:240px;margin-top:20px;">
            <FormItem prop="Name">
                <Input v-model="organizationInfo.Name" placeholder="Name"/>
            </FormItem>
            <!-- <FormItem prop="Address">
                <Input v-model="organizationInfo.Address" placeholder="Web address"/>
            </FormItem> -->
          </Form>
        </div>
        <div slot="footer" style="height:35px;">
          <Button type="primary"  @click="handleCreate">{{$t('Base.OK')}}</Button>
          <Button style="float:left" @click="handCreateCancel">{{$t('Base.Cancel')}}</Button>
        </div>
      </Modal>
    </div>
    <div class="kloudSync-organization-page" v-if="companieApplayArray.length!=0">
      <kloudsync-invitation-Notice :isRegister="true" @getSkip="getSkip"></kloudsync-invitation-Notice>
    </div>
  </div>
</template>

<style lang="scss">
  .kloudSync-organization-page{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f8f9;
    .middle-space{
      width: 600px;
      min-height: 300px;
      border-radius: 4px;
      text-align: left;
      margin-top:-100px;
      background-color: #f8f8f9;
      .logo{
        text-align: center;
        p {
          font-weight: 450;
        }
      }
      .head-info{
        width: 100%;
        text-align: center;
        .head-info-first{
          font-size: 20px;
          font-weight: bold;
          color: rgb(91,110,133)
        }
        .head-info-second{
          font-size: 13px;
          margin-top:10px;
        }
      }
      .action-sapce{
        width: 100%;
        text-align: center;
        span{
          display: inline-block;
        }
      }
    }
  }
  
</style>

<script>
  import auth from "../../authenticator";
  import KloudsyncInvitationNotice from "./KloudsyncInvitationNotice.vue";

  export default {
    props:{
      isOrganizationPage:{
        type:Boolean,
        default:false,
      }
    },
    data() {
      return {
        loading: false,
        joinOrganization: false,
        meetingRoomId: "",
        inviteCodeError: false,
        errorMessage: "Invalid invitation code",
        createOrganization: false,
        organizationInfo: {
          Name: "",
          Address:"",
        },
        organizationInfoRuleInline: {
            Name: [
                { required: true, message: 'Please enter the company name.', trigger: 'blur' }
            ],
            Address: [
                { required: true, message: 'Please enter the company address.', trigger: 'blur' },
            ]
        },
        acceptRequestToChat:true,
        companieApplayArray:[],

        uploadCreateCompanyUrl:'',
        uploadCompanyFileHeaders:{},
        uploadCompanyFile :null,
        uploadCompanyFilePriview:'',
        defaultList:[],
      }
    },
    components: {
      KloudsyncInvitationNotice
    },
    mounted: function () {
    },
    methods: {
      uploadSucess(result, file) {
        // console.warn("11",result);
        // console.warn("22",file);
        this.handCreateCancel();
        this.$router.push({name:routerPrefix() + 'profile'});
      },
      handleUpload(file){
        this.uploadCompanyFile = file;
        let fileReader = new FileReader();
        let self = this;
        fileReader.onload = (e)=>{
          self.uploadCompanyFilePriview = e.target.result;
        }
        fileReader.readAsDataURL(this.uploadCompanyFile);
        return false;
      },
      getSkip(val){
        if(val){
          this.companieApplayArray = [];
        }
      },
       loadCompanies() {
         let self = this;
        return new Promise((resolve, reject) => {
          let url = GetAPIUrl() + 'Invite/CompanyInvitations';
          $.ajax({
            type: "GET",
            url: url,
            beforeSend: function (request) {
              request.setRequestHeader("UserToken",auth.getUserToken());
            },
            success: function (data) {
              if (data.RetCode === 0 && data.RetData && data.RetData.length!=0) {
                self.companieApplayArray = data.RetData.length;
                resolve(data.RetData);
              }else{
                resolve(null);
              }
            },
            error: function (xhr, ajaxOptions, thrownError) {
              console.log(xhr);
              resolve(null);
            }
          });
        });
      },
      showJoinOrganization(){
        this.joinOrganization=true;
      },
      showCreateOrganization(){
        this.createOrganization = true;
        this.uploadCompanyFile = null;
        this.uploadCompanyFilePriview = "";
        this.defaultList = [];
        this.$refs.uploadCreateCompany.clearFiles();
      },
      handleJoin(){
        let self = this;
        let url = GetAPIUrl() + "SchoolContact/AddContactInMeetingRoom?classroomID=" + this.meetingRoomId + "&folderID=-1";
        let data = {};

        this._postData(url, data, null, (result) => {
          self.handJoinCancel();
          self.$router.push({name:routerPrefix() + 'profile'});
        }, error => {
          self.errorMessage = error;
          self.inviteCodeError = true;
        });        
      },
      handJoinCancel(){
        this.joinOrganization = false;
      },
      handleCreate(){
        this.uploadCompanyFileHeaders = {"UserToken": auth.getUserToken()};

        let self = this;
        let url = GetAPIUrl() + "School/CreateSchool";
        let userId = parseInt(auth.getUserID());
        let data = {
          "SchoolName": this.organizationInfo.Name,
          "Category1": 2, //Company
          "Category2": 0,
          "OwnerID": userId,
          "AdminID": userId,
          // "Address":this.organizationInfo.Address
        };
        this.$refs.organizationInfo.validate((valid) => {
            if (valid) {
              self._postData(url, data, null, (result) => {
                if(result && self.uploadCompanyFile){
                  self.uploadCreateCompanyUrl = GetAPIUrl() + 'School/UploadCompanyAvatar?companyID=' + result;

                  self.$nextTick(()=>{
                    self.$refs.uploadCreateCompany.post(self.uploadCompanyFile);//手动上传iview file
                  })
                }
              }, null);
            }
        })
      },
      handCreateCancel(){
        this.createOrganization = false;
      },
      _postData(url, data, before, success, error) {
        if (before && typeof before === 'function') {
          before();
        }

        this.loading = true;
        this.$Loading.start();

        let self = this;
        $.ajax({
          type: 'POST',
          url: url,
          contentType: 'application/json; charset=utf-8',
          dataType: 'text',
          data: JSON.stringify(data),
          beforeSend: function (request) {
            request.setRequestHeader("UserToken", auth.getUserToken());
          },
          success: function (resultString) {
            let result = JSON.parse(resultString);
            if (result.RetCode === 0) {
              self.loading = false;
              self.$Loading.finish();

              if (success && typeof success === 'function') {
                success(result.RetData);
              }
            }
            else { // error
              self.loading = false;
              self.$Loading.error();
              self.$Message.error(result.ErrorMessage);
              console.log(result);

              if (error && typeof error === 'function') {
                error(result.ErrorMessage);
              }
            }
          },
          error: function (xhr, ajaxOptions, thrownError) {
            self.loading = false;
            self.$Loading.error();
            self.$Message.error(xhr.status + ': ' + xhr.statusText);
            console.log(xhr);

            if (error && typeof error === 'function') {
              error(xhr.status + ': ' + xhr.statusText);
            }
          }
        });
      },
    }
  }
</script>
