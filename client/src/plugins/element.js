import Vue from 'vue';
import {
  Header,
  Container,
  Aside,
  Main,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  Select,
  Option,
  Form,
  FormItem,
  Message,
  Checkbox,
  Pagination,
  Dialog,
  Card,
  Input,
  Tabs,
  TabPane,
  Menu,
  MenuItem,
  Row,
  Col,
  Upload,
} from 'element-ui';

Vue.use(Header);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Checkbox);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Card);
Vue.use(Input);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);

Vue.prototype.$message = Message;
