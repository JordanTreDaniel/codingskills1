namespace codingskills {

    angular.module('codingskills', ['ngStorage','ui.router', 'ngResource', 'ngMaterial'])
    .config((
        $stateProvider: ng.ui.IStateProvider,
        $resourceProvider: ng.ui.IStateProvider,
        $httpProvider: ng.IHttpProvider,
        $urlRouterProvider: ng.ui.IUrlRouterProvider,
        $mdThemingProvider: ng.material.IThemingProvider,
        $mdIconProvider: ng.material.IIconProvider,
        $locationProvider: ng.ILocationProvider
    ) => {
        // Define routes
        $stateProvider
          .state('nav', {
              url: '',
              templateUrl: '/ngApp/views/nav.html',
              controller: codingskills.Controllers.NavController,
              abstract: true,
              controllerAs: 'vm',
              resolve: {
                currentUser: ['Session', function (Session) {
                  return Session.getUser();
                }],
                isAuthenticated: ['Session', function (Session) {
                  return Session.isAuthenticated();
                }],
                currentNavItem: ['$state', function ($state) {
                  return $state.current.name;
                }]
              }
          })
          .state('home', {
              url: '/',
              templateUrl: '/ngApp/views/home.html',
              controller: codingskills.Controllers.HomeController,
              controllerAs: 'controller',
              parent: 'nav'
          })





          .state('gym', {
              url: '/gym',
              templateUrl: '/ngApp/views/gym.html',
              controller: codingskills.Controllers.GymController,
              controllerAs: 'controller',
              params: {automaticallyStart: false},
              parent: 'nav',
          })
          .state('scoreboard', {
              url: '/scoreboard',
              templateUrl: '/ngApp/views/scoreboard.html',
              controller: codingskills.Controllers.ScoreboardController,
              controllerAs: 'controller',
              parent: 'gym'
          })


          .state('courtside', {
              url: '/courtside',
              templateUrl: '/ngApp/views/courtside.html',
              controller: codingskills.Controllers.CourtsideController,
              controllerAs: 'controller',
              params: {gameObject: {}},
              parent: 'nav'
          })
          .state('lockerroom', {
              url: '/lockerroom',
              templateUrl: '/ngApp/views/lockerroom.html',
              controller: codingskills.Controllers.LockerroomController,
              controllerAs: 'controller',
              params: {stats: {}},
              parent: 'nav'
          })





          .state('account', {
              url: '/account',
              templateUrl: '/ngApp/views/account.html',
              controller: codingskills.Controllers.AccountController,
              parent: 'nav',
              controllerAs: 'controller'
          })
          .state('myaccount', {
              url: '/:username',
              templateUrl: '/ngApp/views/myaccount.html',
              controller: codingskills.Controllers.MyAccountController,
              controllerAs: "controller",
              parent: 'account'
          })
       





          .state('about', {
              url: '/about',
              templateUrl: '/ngApp/views/about.html',
              controller: codingskills.Controllers.AboutController,
              controllerAs: 'controller',
              parent: 'nav'
          })
          .state('notFound', {
              url: '/notFound',
              templateUrl: '/ngApp/views/notFound.html',
              parent: 'nav'
          });
          $mdThemingProvider.theme('default')
        .backgroundPalette('grey', {
            'default': '800'
        })
        .primaryPalette('grey', {
            'default': '300', // by default use shade 400 from the pink palette for primary intentions
            'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
            'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
            'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
        })
        .accentPalette('grey', {
            'default': '700',
            'hue-1': '900'
        })

    // If you specify less than all of the keys, it will inherit from the
    // default shades
        .warnPalette('red', {
            'default': '900' // use shade 200 for default, and keep all other shades the same
        });
        const iconPath =  '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';


        // Handle request for non-existent route
        $urlRouterProvider.otherwise('/notFound');

        // Enable HTML5 navigation
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false,
          rewriteLinks: false
        });

        $httpProvider.interceptors.push('authInterceptor');
    }).factory('authInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
      return {
        responseError: function (response) {
          $rootScope.$broadcast({
            401: AUTH_EVENTS.notAuthenticated,
            403: AUTH_EVENTS.notAuthorized,
            419: AUTH_EVENTS.sessionTimeout,
            440: AUTH_EVENTS.sessionTimeout
          }[response.status], response);
          return $q.reject(response);
        }
      };
    })
    .run(
      [
        '$rootScope',
        'UserService',
        '$sessionStorage',
        'Session',
        '$state',
        'AUTH_EVENTS',
        (
          $rootScope,
          UserService,
          $sessionStorage,
          Session,
          $state: ng.ui.IStateService,
          AUTH_EVENTS
        ) => {
          $rootScope.$on('$stateChangeStart', (event, next) => {
            let authorizedRoles = false;
            UserService.getCurrentUser().then((user) => {
              $sessionStorage.user = user;
            }).catch((user) => {
              $sessionStorage.user = user;
            });

            if(next.data) {
              authorizedRoles = next.data['authorizedRoles'] ? next.data['authorizedRoles'] : false;
            }

            if (authorizedRoles && !Session.isAuthorized(authorizedRoles)) {
              event.preventDefault();
              if(Session.isAuthenticated()){
                //TODO dialog
                // $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                $state.go('home');
              } else {
                // $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                $state.go('home');
              }
            }
          });
        }
      ]
    );
}
