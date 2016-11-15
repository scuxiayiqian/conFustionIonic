'use strict';

angular.module('conFusion.services', ['ngResource'])
      .constant("baseURL","http://localhost:3000/")
      // .constant("baseURL", "http://192.168.1.23:3000/")
      .factory('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {

          return $resource(baseURL + "dishes/:id", null, {
                'update': {
                    method: 'PUT'
                }
          });
          // var promotions = [
          //     {
          //       _id:0,
          //       name:'Weekend Grand Buffet', 
          //       image: 'images/buffet.png',
          //       label:'New',
          //       price:'19.99',
          //       description:'Featuring mouthwatering combinations with a choice of five different salads, six enticing appetizers, six main entrees and five choicest desserts. Free flowing bubbly and soft drinks. All for just $19.99 per person ',
          //     }
              
          // ];

          // this.getDishes = function(){
              
          //     return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});
              
          // };

          // // implement a function named getPromotion
          // // that returns a selected promotion.
          // this.getPromotion = function() {
          //     return   $resource(baseURL+"promotions/:id");
          // }
      }])

      .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
          
          return $resource(baseURL + "promotions/:id");

      }])

      .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {

          return $resource(baseURL+"leadership/:id");

      }])

      .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {

          return $resource(baseURL+"feedback/:id");

      }])

      .factory('favoriteFactory', ['$resource', 'baseURL', '$localStorage' , function ($resource, baseURL, $localStorage) {
          
          var favFac = {};
          var favorites = [];
          // $localStorage.storeObject('fvrts', favorites);

          favFac.addToFavorites = function (index) {
              // for (var i = 0; i < favorites.length; i++) {
              //     if (favorites[i] == index)
              //         return;
              // }
              // favorites.push(index);

              favorites = $localStorage.getObject('fvrts');
              if (favorites.indexOf(index) == -1) {
                favorites.push(index);
                $localStorage.storeObject('fvrts', favorites);
              } 
              else {
                return;
              }
          };

          favFac.deleteFromFavorites = function (index) {
              // for (var i = 0; i < favorites.length; i++) {
              //     if (favorites[i] == index) {
              //         favorites.splice(i, 1);
              //     }
              // }

              favorites = $localStorage.getObject('fvrts');
              var idx = favorites.indexOf(index);
              if (idx != -1) {
                favorites.splice(idx, 1);
              }

              // console.log(favorites);
              $localStorage.storeObject('fvrts', favorites);
          };

          favFac.getFavorites = function () {
            favorites = $localStorage.getObject('fvrts', []);
            // return favorites;
            // console.log(Array.isArray(favorites));
            // return favorites;
            // console.log($localStorage.getObject('fvrts', []));
            console.log('getFavorites');
            return favorites;
          };
          
          return favFac;
      }])

      .factory('$localStorage', ['$window', function($window) {
        return {
          store: function(key, value) {
            $window.localStorage[key] = value;
          },
          get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
          },
          storeObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
          },
          getObject: function(key,defaultValue) {
            console.log("get objs");
            return JSON.parse($window.localStorage[key] || defaultValue);
          }
        }
      }])
;