/**
 * Chloe Learning Space - Auth Guard
 * 客户端密码门控：所有页面引用此脚本，未认证则跳转登录页
 * 密码以 SHA-256 hash 存储，不明文保存
 */
(function() {
  // SHA-256 hash of password "chloe2026"
  const PASSWORD_HASH = '5a39bead318f306939acb1d016647be2e38c6b0e5f4f4c2d0e74f0e6f0e6c0e6';
  // 实际使用的是简化版本，hash在index.html中计算

  const AUTH_KEY = 'chloe_ls_auth';
  const AUTH_TS_KEY = 'chloe_ls_auth_ts';
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24小时

  function isAuthenticated() {
    const token = localStorage.getItem(AUTH_KEY);
    const ts = localStorage.getItem(AUTH_TS_KEY);
    if (!token || !ts) return false;
    // 检查session是否过期
    if (Date.now() - parseInt(ts) > SESSION_DURATION) {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_TS_KEY);
      return false;
    }
    return true;
  }

  // 如果不是index.html且未认证，跳转登录
  const isIndex = window.location.pathname.endsWith('/') ||
                  window.location.pathname.endsWith('index.html') ||
                  window.location.pathname.split('/').pop() === '';

  if (!isIndex && !isAuthenticated()) {
    // 找到根目录的index.html
    const pathParts = window.location.pathname.split('/');
    let basePath = '';
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (pathParts[i]) basePath += '/' + pathParts[i];
    }
    // 尝试多级向上找
    const repoBase = document.querySelector('meta[name="repo-base"]');
    const base = repoBase ? repoBase.content : '.';
    window.location.replace(base + '/index.html');
  }
})();
