
//MAINTAIN ALPHABETICALLY
angular.module('codingskills')
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('IP_INFO', '//ipinfo.io/json')
  .constant('LEVELS', {
      1: ['a', 's', 'd', 'f', 'g'],
      2: ['h', 'j', 'k', 'l', ';'],
      3: ['q', 'w', 'e', 'r', 't'],
      4: ['y', 'u', 'i', 'o', 'p'],
      5: ['z', 'x', 'c', 'v', 'b'],
      6: ['b', 'n', 'm'],
      7: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      8: ['-', '=', ';', "'", ',', '.', '/', '\\']
  })
  .constant('PAGINATION_LIMIT', 10)
  .constant('TIMEOUTS', {
    user_resolve: 7500
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin'
  });
