namespace codingskills.Services {
    export class WordService {
        constructor($resource: ng.resource.IResourceService) {
            this.WordResource = $resource('/api/words');
        }
        public WordResource;
        public ping() {
            return this.WordResource.get().$promise;
        }
        public save(words) {
            return this.WordResource.save(words).$promise;
        }
    }
    angular.module('codingskills').service('wordService', WordService);
}
