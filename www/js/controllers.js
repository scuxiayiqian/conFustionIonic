angular.module('conFusion.controllers', [])

.filter('favoriteFilter', function () {
  return function (dishes, favorites) {
      var out = [];
      for (var i = 0; i < favorites.length; i++) {
          // console.log("+1" + favorites);
          for (var j = 0; j < dishes.length; j++) {
              if (dishes[j].id === favorites[i])
              // if (dishes[j].id === favorites[i])
                  out.push(dishes[j]);
          }
      }
      // console.log(out);
      return out;
  }})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localStorage) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  // $scope.loginData = {};
  $scope.loginData = $localStorage.getObject('userinfo', '{}');

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    $localStorage.storeObject('userinfo', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.reservation = {};

  // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  };    
})

// .controller('MenuController', 
//   ['$scope', 'menuFactory', 'baseURL', function($scope, menuFactory, baseURL) {            
.controller('MenuController', 
  ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', 'dishes', '$localStorage',
  function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, dishes, $localStorage) { 

  $scope.baseURL = baseURL;
  $scope.tab = 1;
  $scope.filtText = '';
  $scope.showDetails = false;

  $scope.message = "Loading ...";
  $scope.dishes = dishes;

  // menuFactory.query(
  //     function(response) {
  //         $scope.dishes = response;
  //         $scope.showMenu = true;
  //     },
  //     function(response) {
  //         $scope.message = "Error: "+response.status + " " + response.statusText;
  //     });

              
  $scope.select = function(setTab) {
      $scope.tab = setTab;
      
      if (setTab === 2) {
          $scope.filtText = "appetizer";
      }
      else if (setTab === 3) {
          $scope.filtText = "mains";
      }
      else if (setTab === 4) {
          $scope.filtText = "dessert";
      }
      else {
          $scope.filtText = "";
      }
  };

  $scope.isSelected = function (checkTab) {
      return ($scope.tab === checkTab);
  };

  $scope.toggleDetails = function() {
      $scope.showDetails = !$scope.showDetails;
  };

  $scope.addFavorite = function (index) {
      console.log("index is " + index);
      
      favoriteFactory.addToFavorites(index);

      $ionicListDelegate.closeOptionButtons();
  };

}])

.controller('ContactController', ['$scope', function($scope) {

  $scope.address = {
      'road': '121, Clear Water Bay Road ',
      'district': 'Clear Water Bay, Kowloon',
      'city': 'HONG KONG',
      'tel': '+852 1234 5678',
      'fax': '+852 8765 4321',
      'email': 'confusion@food.net'
  };

  $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
  
  var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
  
  $scope.channels = channels;
  $scope.invalidChannelSelection = false;
              
}])

.controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
  
  $scope.sendFeedback = function() {
      
      console.log($scope.feedback);
      
      if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
          $scope.invalidChannelSelection = true;
          console.log('incorrect');
      }
      else {
          $scope.invalidChannelSelection = false;
          feedbackFactory.save($scope.feedback);
          $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
          $scope.feedback.mychannel="";
          $scope.feedbackForm.$setPristine();
          console.log($scope.feedback);
      }
    };
  }])

.controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal', 
  function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal) {  
  // $scope.baseURL = baseURL;
  // $scope.dish = {};

  $scope.baseURL = baseURL;
  $scope.dish = dish;

  $scope.showDish = false;
  $scope.message="Loading ...";
  
  $scope.dish = menuFactory.get({id:parseInt($stateParams.id,10)})
  .$promise.then(
                  function(response){
                      $scope.dish = response;
                      $scope.showDish = true;
                  },
                  function(response) {
                      $scope.message = "Error: "+response.status + " " + response.statusText;
                  }
  );

  // add to favorite
  $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.addToFavorites = function() {
    console.log($scope.dish.id);
    favoriteFactory.addToFavorites($scope.dish.id);
    $scope.popover.hide();
  };

  // $scope.showCommentModal = function() {
  //   console.log("show comment modal");
  //   $scope.comment();
  // }

  $scope.comment = {};

  // comment
  $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.commentform = modal;
  });

  $scope.closeComment = function() {
    $scope.commentform.hide();
  };

  $scope.showComment = function() {
    console.log("show comment modal");
    $scope.commentform.show();
  };

  $scope.doComment = function() {

    $scope.comment.date = new Date().toISOString();
    console.log($scope.comment);
      
    $scope.dish.comments.push($scope.comment);
    menuFactory.update({id:$scope.dish.id},$scope.dish);
    
    $scope.closeComment();
    $scope.popover.hide();
  }; 

}])

.controller('DishCommentController', ['$scope', 'menuFactory', function($scope,menuFactory) {
  
  $scope.mycomment = {rating:5, comment:"", author:"", date:""};
  
  $scope.submitComment = function () {
      
      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);
      
      $scope.dish.comments.push($scope.mycomment);
menuFactory.update({id:$scope.dish.id},$scope.dish);
      
      $scope.commentForm.$setPristine();
      
      $scope.mycomment = {rating:5, comment:"", author:"", date:""};
  }

}])

// implement the IndexController and About Controller here

.controller('IndexController', ['$scope', 'leader', 'dish', 'promotion', 'menuFactory', 'corporateFactory', 'baseURL', function($scope, menuFactory, corporateFactory, baseURL) {

      $scope.baseURL = baseURL;
      $scope.leader = leader;
      $scope.dish = dish;
      $scope.promotion = promotion;

  }])

.controller('AboutController', 
  ['$scope', 'leaders', 'baseURL', 
  function($scope, leaders, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leaders = leaders;

    $scope.histories = [
      'Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.',
      'The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world\'s best cuisines in a pan.'
    ];

  }])

.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'menuFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading',
  function ($scope, dishes, favorites, favoriteFactory, menuFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading) {
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $scope.dishes = dishes;
    $scope.favorites = favorites;
    console.log('----');

      // $scope.dishes.$promise.then(function(data) {
      //    $scope.dishes = data;

      //    var out = [];
      //    for (var i = 0; i < favorites.length; i++) {
      //       // console.log("+1" + favorites);
      //       for (var j = 0; j < dishes.length; j++) {
      //           if (dishes[j].id === favorites[i])
      //             out.push(dishes[j]);
      //           // if (dishes[j].id === favorites[i])
      //       }
      //     }
      //     $scope.fvrtDishes = out;
      //     console.log($scope.fvrtDishes);
      // });
    

    // $scope.getFavorites = function() {
    //   var out = [];
    //   for (var i = 0; i < $scope.favorites.length; i++) {
    //       // console.log("+1" + favorites);
    //       for (var j = 0; j < $scope.dishes.length; j++) {
    //           if ($scope.dishes[j].id === $scope.favorites[i])
    //             out.push($scope.dishes[j]);
    //           // if (dishes[j].id === favorites[i])
    //       }
    //   }
    //   console.log($scope.favorites);
    //   console.log($scope.dishes);
    //   console.log(out);

    //   return out;
    // }

    // $scope.fvrtDishes = $scope.getFavorites();
    // console.log($scope.fvrtDishes);

    $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm Delete',
            template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                console.log('Ok to delete');
                favoriteFactory.deleteFromFavorites(index);
                
                $scope.dishes = dishes;
                $scope.favorites = favorites;
            } else {
                console.log('Canceled delete');
            }
        });

        $scope.shouldShowDelete = false;
    }

  }])

  .controller('IndexController', ['$scope', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL', function ($scope, menuFactory, promotionFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = corporateFactory.get({
        id: 3
    });

    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = menuFactory.get({
            id: 0
        })
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.promotion = promotionFactory.get({
        id: 0
    });

  }])
;
