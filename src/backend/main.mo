import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Menu item type definition
  public type MenuItem = {
    name : Text;
    description : Text;
    price : Nat; // Price in rupees
    category : Category;
    available : Bool;
  };

  public type Category = {
    #monthlyFood;
    #specialPerKg;
    #gymProtein;
  };

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Convert category to text for comparison
  module Category {
    public func toText(category : Category) : Text {
      switch (category) {
        case (#monthlyFood) { "Monthly Food" };
        case (#specialPerKg) { "Special Per Kg" };
        case (#gymProtein) { "Gym Protein" };
      };
    };

    public func compare(category1 : Category, category2 : Category) : Order.Order {
      Text.compare(toText(category1), toText(category2));
    };
  };

  module MenuItem {
    public func compare(menuItem1 : MenuItem, menuItem2 : MenuItem) : Order.Order {
      Text.compare(menuItem1.name, menuItem2.name);
    };
  };

  // Store menu items in a persistent Map with Id as key
  var nextItemId = 0;
  let persistentMenuItems = Map.empty<Nat, MenuItem>();

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to create sample items for each category
  func getSampleItems() : [(Nat, MenuItem)] {
    [
      (
        nextItemId,
        {
          name = "Monthly Meal Plan (Veg)";
          description = "Lunch only, 3 days/week veg meals";
          price = 2000;
          category = #monthlyFood;
          available = true;
        },
      ),
      (
        nextItemId + 1,
        {
          name = "Monthly Meal Plan (Non-Veg)";
          description = "Lunch only, 3 days fish/egg + 1 day chicken per week";
          price = 2500;
          category = #monthlyFood;
          available = true;
        },
      ),
      (
        nextItemId + 2,
        {
          name = "Fried Rice";
          description = "Freshly prepared fried rice with homemade spices";
          price = 180;
          category = #specialPerKg;
          available = true;
        },
      ),
      (
        nextItemId + 3,
        {
          name = "Mixed Fried Rice";
          description = "Mixed vegetables and egg fried rice with homemade spices";
          price = 200;
          category = #specialPerKg;
          available = true;
        },
      ),
      (
        nextItemId + 4,
        {
          name = "Polao";
          description = "Fragrant rice dish cooked with homemade spices";
          price = 200;
          category = #specialPerKg;
          available = true;
        },
      ),
      (
        nextItemId + 5,
        {
          name = "Chicken Recipe (Signature)";
          description = "Various signature chicken preparations";
          price = 350;
          category = #specialPerKg;
          available = true;
        },
      ),
      (
        nextItemId + 6,
        {
          name = "Chicken Biryani";
          description = "Aromatic biryani with tender chicken and homemade spices";
          price = 380;
          category = #specialPerKg;
          available = true;
        },
      ),
      (
        nextItemId + 7,
        {
          name = "Mutton (500g also available)";
          description = "Slow-cooked mutton with homemade spices, 500g portion also available";
          price = 500;
          category = #specialPerKg;
          available = true;
        },
      ),
      (
        nextItemId + 8,
        {
          name = "Veg Salad";
          description = "Fresh seasonal vegetables salad";
          price = 80;
          category = #gymProtein;
          available = true;
        },
      ),
      (
        nextItemId + 9,
        {
          name = "Fruit Salad";
          description = "Assorted fresh fruits salad";
          price = 100;
          category = #gymProtein;
          available = true;
        },
      ),
      (
        nextItemId + 10,
        {
          name = "Protein Salad";
          description = "Sprouted or soaked kala chana and green moong protein salad";
          price = 120;
          category = #gymProtein;
          available = true;
        },
      ),
      (
        nextItemId + 11,
        {
          name = "Protein Shake";
          description = "Nutritious protein shake for fitness goals";
          price = 100;
          category = #gymProtein;
          available = true;
        },
      ),
    ];
  };

  // Seed persistent store with sample items on first admin interaction
  public shared ({ caller }) func seedSampleItems() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    // Add items to persistent store
    let sampleItems = getSampleItems();
    for (item in sampleItems.values()) {
      persistentMenuItems.add(item.0, item.1);
    };

    // Update item ID counter
    nextItemId += sampleItems.size();
  };

  // Admin functions for menu item management
  public shared ({ caller }) func addPersistentMenuItem(menuItem : MenuItem) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = nextItemId;
    persistentMenuItems.add(id, menuItem);
    nextItemId += 1;
    id;
  };

  public shared ({ caller }) func updatePersistentMenuItem(id : Nat, menuItem : MenuItem) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not persistentMenuItems.containsKey(id)) {
      Runtime.trap("Item not found");
    };
    persistentMenuItems.add(id, menuItem);
  };

  public shared ({ caller }) func deletePersistentMenuItem(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    if (not persistentMenuItems.containsKey(id)) {
      Runtime.trap("Item not found");
    };
    persistentMenuItems.remove(id);
  };

  public query func getPersistentMenuItem(id : Nat) : async MenuItem {
    switch (persistentMenuItems.get(id)) {
      case (null) { Runtime.trap("Item not found") };
      case (?item) { item };
    };
  };

  public query func getPersistentMenuItemsByCategory(category : Category) : async [MenuItem] {
    persistentMenuItems.values().toArray().filter<MenuItem>(
      func(item) { item.category == category }
    );
  };

  public query func getAllPersistentMenuItems() : async [MenuItem] {
    persistentMenuItems.values().toArray().sort<MenuItem>();
  };

  public query func getAllPersistentMenuItemsByCategory() : async [(Category, [MenuItem])] {
    let categories : [Category] = [#monthlyFood, #specialPerKg, #gymProtein];
    categories.map<Category, (Category, [MenuItem])>(
      func(cat) {
        (
          cat,
          persistentMenuItems.values().toArray().filter<MenuItem>(
            func(item) { item.category == cat }
          )
        )
      }
    );
  };
};
