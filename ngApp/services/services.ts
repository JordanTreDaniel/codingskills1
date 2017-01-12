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

  angular.module('codingskills').service('UserService', UserService);
  angular.module('codingskills').service('wordService', WordService);
  
}
