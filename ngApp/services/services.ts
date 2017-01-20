namespace codingskills.Services {
    export class WordService {
        constructor($resource: ng.resource.IResourceService) {
            this.WordResource = $resource('/api/words');
        }
        public WordResource;
        public get(patternObj) {
            return this.WordResource.get(patternObj).$promise;
        }
        public save(words) {
            return this.WordResource.save(words).$promise;
        }
    }
    export class GameService {
      constructor($resource: ng.resource.IResourceService) {
        this.GameResource = $resource('/api/games/:id');
      }
      private GameResource;
      public save(game) {
        return this.GameResource.save(game).$promise;
      }
      public get(id) {
        return this.GameResource.get(id).$promise;
      }
      public delete(id) {
        return this.GameResource.delete(id).$promise;
      }
    }
    export class UserService {
      private LoginResource;
      private LogoutResource;
      private RegisterResource;
      public UserResource;
      private isLoggedIn;

      public login(user) {
        return this.LoginResource.save(user).$promise;
      }

      public logout() {
        return this.LogoutResource.get().$promise;
      }

      public register(user) {
        return this.RegisterResource.save(user).$promise;
      }

      public getUser(id) {
        return this.UserResource.get(id).$promise;
      }

      public getCurrentUser() {
        return this.$resource('/api/currentuser').get().$promise;
      }

      constructor(private $resource: ng.resource.IResourceService) {

        this.LogoutResource = $resource('/api/logout/local');
        this.LoginResource = $resource('/api/login/local');
        this.RegisterResource = $resource('/api/Register');
        this.UserResource = $resource('/api/users/:id');
      }
    }

    export class Session {
      public user;

      constructor(
        private $sessionStorage: angular.storage.IStorageService
      ) {
        this.user = this.getUser();
      }

      create(user) {
        this.$sessionStorage['user'] = user;
      }

      isAuthenticated() {
        let user = this.getUser();
        return !!user['username'];
      }

      isAuthorized(roles) {
        let user = this.getUser();
        if (!user['roles']){
          return false;
        }

        if (!angular.isArray(roles)) {
          roles = [roles];
        }

        return roles.some((v, k) => {
          for(let i in user['roles']) {
            if (user['roles'][i] === v) {
              return true;
            }
          }
        });
      }

      getUser() {
        return this.$sessionStorage['user'] || {};
      }

      destroy() {
        this.$sessionStorage.$reset();
        this.$sessionStorage['user'] = {};
      }
    }

  angular.module('codingskills').service('Session', Session);
  angular.module('codingskills').service('UserService', UserService);
  angular.module('codingskills').service('wordService', WordService);
  angular.module('codingskills').service('gameService', GameService);
  

}
