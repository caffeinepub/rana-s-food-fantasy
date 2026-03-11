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

  public type UserProfile = {
    name : Text;
  };

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

  // Default menu items
  let defaultItems : [(Nat, MenuItem)] = [
    (
      0,
      {
        name = "Monthly Meal Plan";
        description = "Lunch only — Veg + Non-Veg. 3 days veg + 3 days fish/egg + 1 day chicken per week";
        price = 2000;
        category = #monthlyFood;
        available = true;
      },
    ),
    (
      1,
      {
        name = "Fried Rice";
        description = "Freshly prepared with homemade spices";
        price = 180;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      2,
      {
        name = "Mixed Fried Rice";
        description = "Mixed vegetables and egg fried rice with homemade spices";
        price = 200;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      3,
      {
        name = "Polao";
        description = "Fragrant rice dish cooked with homemade spices";
        price = 200;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      4,
      {
        name = "Chicken Recipe (Various)";
        description = "Various signature chicken preparations using homemade spices";
        price = 350;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      5,
      {
        name = "Chicken Biryani";
        description = "Aromatic biryani with tender chicken and homemade spices";
        price = 380;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      6,
      {
        name = "Mutton";
        description = "Slow-cooked mutton with homemade spices. 500g portion also available";
        price = 500;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      7,
      {
        name = "Veg Salad";
        description = "Fresh seasonal vegetables salad";
        price = 80;
        category = #gymProtein;
        available = true;
      },
    ),
    (
      8,
      {
        name = "Fruit Salad";
        description = "Assorted fresh fruits salad";
        price = 100;
        category = #gymProtein;
        available = true;
      },
    ),
    (
      9,
      {
        name = "Protein Salad";
        description = "Sprouted or soaked kala chana and green moong protein salad";
        price = 120;
        category = #gymProtein;
        available = true;
      },
    ),
    (
      10,
      {
        name = "Protein Shake";
        description = "Nutritious protein shake for fitness goals";
        price = 100;
        category = #gymProtein;
        available = true;
      },
    ),
    (
      11,
      {
        name = "Whole & Dust Turmeric";
        description = "Pure homemade turmeric — whole and powder form";
        price = 150;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      12,
      {
        name = "Whole & Dust Jeera";
        description = "Pure homemade cumin — whole and powder form";
        price = 120;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      13,
      {
        name = "Whole & Dust Coriander";
        description = "Pure homemade coriander — whole and powder form";
        price = 100;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      14,
      {
        name = "Homemade Garam Masala";
        description = "Freshly ground garam masala made with traditional recipe";
        price = 200;
        category = #specialPerKg;
        available = true;
      },
    ),
    (
      15,
      {
        name = "Biryani Masala & Mixed Masalas";
        description = "Homemade biryani masala and other mixed masala blends";
        price = 180;
        category = #specialPerKg;
        available = true;
      },
    ),
  ];

  // Initialize with default menu items on first deploy only (skip if already has data)
  if (persistentMenuItems.size() == 0) {
    for (item in defaultItems.values()) {
      persistentMenuItems.add(item.0, item.1);
    };
    nextItemId := defaultItems.size();
  };

  // Seed persistent store with sample items (reset to defaults)
  public shared func seedSampleItems() : async () {
    for (item in defaultItems.values()) {
      persistentMenuItems.add(item.0, item.1);
    };
    nextItemId := defaultItems.size();
  };

  // Menu item management functions (no auth required — admin protected by frontend password)
  public shared func addPersistentMenuItem(menuItem : MenuItem) : async Nat {
    let id = nextItemId;
    persistentMenuItems.add(id, menuItem);
    nextItemId += 1;
    id;
  };

  public shared func updatePersistentMenuItem(id : Nat, menuItem : MenuItem) : async () {
    if (not persistentMenuItems.containsKey(id)) {
      Runtime.trap("Item not found");
    };
    persistentMenuItems.add(id, menuItem);
  };

  public shared func deletePersistentMenuItem(id : Nat) : async () {
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

  public query func getAllPersistentMenuItems() : async [(Nat, MenuItem)] {
    persistentMenuItems.entries().toArray();
  };

  public query func getAllPersistentMenuItemsByCategory() : async [(Category, [(Nat, MenuItem)])] {
    let categories : [Category] = [#monthlyFood, #specialPerKg, #gymProtein];
    categories.map<Category, (Category, [(Nat, MenuItem)])>(
      func(cat) {
        (
          cat,
          persistentMenuItems.entries().toArray().filter<(Nat, MenuItem)>(
            func(entry) { entry.1.category == cat }
          )
        )
      }
    );
  };
};
