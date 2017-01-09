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
    angular.module('codingskills').service('wordService', WordService);
}
