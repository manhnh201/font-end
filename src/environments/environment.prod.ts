import { MenuItem } from "src/app/common-module/dto/menu-item";

export const environment = {
  production: true,
  apiUrl: '/kbs-oss-be',

  feedbackApiUrl: '/cms/manager',

  applicationShortName: 'KBS OSS',
  applicationName: 'site.title',
  copyright: 'Copyright @KBSecurities 2022 | Privacy Policy',

  /**
   * Page mặc định load khi reload trang ở page root
   * Trang không sử dụng MenuGuard
   */
  defaultRedirect: {
    _default: '/main/order-list',
  },

  /**
   * Menu đc render phía server
   */
  serverSideMenu: false,
  /**
   * Có hiển thị breadcrumb không
   */
  hasBreadcrumb: true,

  clientId: 'periodic-buying',
  ACCESS_TOKEN_KEY: "access_token",
  LOGIN_ENPOINT: "/api/v1/user/login",
  EXTEND_SESSION_ENDPOINT: "/api/v1/refreshToken",
  EXTEND_SESSION_METHOD: "GET",
  LOGOUT_ENPOINT: "/api/v1/user/logout",
  IDLE_TIME_TO_AUTO_LOGOUT: 3600,
  REMAINING_TIME_TO_EXTEND_SESSION: 30,

  LOG_LEVEL: 'DEBUG',

  menuItems: [
    new MenuItem("Order List", [], 'shopping-cart', '', ['main', 'order-list'], {}, ['ROLE_OSS_ADMIN']),
    new MenuItem("Order Detail", [], 'unordered-list', '', ['main', 'peri-order-detail'], {}, ['ROLE_OSS_ADMIN']),
    new MenuItem("Feedback", [], 'comment', '', ['main', 'feedback'], {}, ['ROLE_OSS_ADMIN']),
  ],

  tinyMCEApiKey: 'xcbq425j9z6hqxn3pioex9kkvnxxbhra5z4haem4yx60tlnq',
  editorInit: {
    plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap emoticons',
    menubar: 'file edit view insert format tools table help',
    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
  },

  //FE có cần xác thực không
  authRequired: true,

  /**
   * Danh sách phân hệ
   */
  modules: [
    new MenuItem('SSO Account Management', [], '', `http://10.100.20.99:8085/realms/kbs/account/#/`),
    new MenuItem('', [], '', '', [], {}, [], false, 'divider'),
    new MenuItem('Authentication', [], '', `http://10.100.120.58/auth`),
    new MenuItem('Email Automation', [], '', `http://10.100.20.99`),
    new MenuItem('Messaging Platform', [], '', `http://10.100.20.99/messaging-platform`),
    new MenuItem('KBS CMS', [], '', `http://10.100.120.58/cms`),
    new MenuItem('CMS Portal', [], '', `http://10.100.120.57`),
    new MenuItem('Loyalty', [], '', ``),
    new MenuItem('', [], '', '', [], {}, [], false, 'divider'),
    new MenuItem('JIRA', [], '', `http://jira.kbsec.com.vn/secure/Dashboard.jspa`),
    new MenuItem('Confulence', [], '', 'http://10.100.20.67:81'),
  ],

  /**
   * SSO
   * http://10.100.20.99:8085/realms/kbs/protocol/openid-connect/auth?client_id=cms
   * &redirect_uri=https://openidconnect.net/callback
   * &scope=openid profile email phone address
   * &response_type=code
   * &state=c649c936418b361fec45554fe73169805b683fdd
   */
  oidc: {
    enable: true,
    url: 'http://10.100.20.99:8085',
    realm: "kbs",
    clientId: 'periodic-buying',
    scope: 'openid profile email phone address',
    responseType: 'code'
  }
};
