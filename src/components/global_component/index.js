import NoticeMsg from '../NoticeMsg.vue';
import AddChatFriendModal from '../chat/AddChatFriendModal.vue';
import PhoneAreaCode from './PhoneAreaCode.vue';

export default (Vue) => {
  Vue.component("notice-msg", NoticeMsg)
  Vue.component('add-chat-friend-modal', AddChatFriendModal)
  Vue.component('phone-area-code', PhoneAreaCode)
}