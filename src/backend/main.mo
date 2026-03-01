import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  // Types
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Category;
    inStock : Bool;
  };

  type Service = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    duration : Text;
  };

  type ShopInfo = {
    name : Text;
    address : Text;
    phone : Text;
    email : Text;
    hours : Text;
  };

  type Category = {
    #Desktop;
    #Laptop;
    #Accessories;
    #Monitors;
  };

  // Modules for comparison and category conversion
  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  module Service {
    public func compare(s1 : Service, s2 : Service) : Order.Order {
      Text.compare(s1.name, s2.name);
    };
  };

  module Category {
    public func toText(category : Category) : Text {
      switch (category) {
        case (#Desktop) { "Desktop" };
        case (#Laptop) { "Laptop" };
        case (#Accessories) { "Accessories" };
        case (#Monitors) { "Monitors" };
      };
    };
  };

  // Persistent storage using immutable data structures
  let products = Map.empty<Nat, Product>();
  let services = Map.empty<Nat, Service>();
  var nextProductId = 7;
  var nextServiceId = 5;

  // Initial shop info
  let shopInfo : ShopInfo = {
    name = "RS Computers";
    address = "123 Tech Lane, Silicon City, 98765";
    phone = "555-123-4567";
    email = "contact@rscomputers.com";
    hours = "Mon-Fri: 9am-6pm, Sat: 10am-4pm, Sun: Closed";
  };

  // Seed data function
  public shared ({ caller }) func seedData() : async () {
    // Products
    products.add(
      1,
      {
        id = 1;
        name = "Gaming Desktop";
        description = "High-performance desktop for gaming";
        price = 1500.00;
        category = #Desktop;
        inStock = true;
      },
    );
    products.add(
      2,
      {
        id = 2;
        name = "Business Laptop";
        description = "Lightweight laptop for professionals";
        price = 900.00;
        category = #Laptop;
        inStock = true;
      },
    );
    products.add(
      3,
      {
        id = 3;
        name = "24\" Monitor";
        description = "Full HD monitor";
        price = 180.00;
        category = #Monitors;
        inStock = true;
      },
    );
    products.add(
      4,
      {
        id = 4;
        name = "Wireless Mouse";
        description = "Ergonomic wireless mouse";
        price = 25.00;
        category = #Accessories;
        inStock = true;
      },
    );
    products.add(
      5,
      {
        id = 5;
        name = "Gaming Laptop";
        description = "Laptop with high-end graphics";
        price = 1200.00;
        category = #Laptop;
        inStock = false;
      },
    );
    products.add(
      6,
      {
        id = 6;
        name = "Mechanical Keyboard";
        description = "RGB mechanical keyboard";
        price = 70.00;
        category = #Accessories;
        inStock = true;
      },
    );

    // Services
    services.add(
      1,
      {
        id = 1;
        name = "PC Repair";
        description = "General computer repair services";
        price = 50.00;
        duration = "1-3 days";
      },
    );
    services.add(
      2,
      {
        id = 2;
        name = "Hardware Upgrade";
        description = "RAM, SSD, and other upgrades";
        price = 30.00;
        duration = "Same day";
      },
    );
    services.add(
      3,
      {
        id = 3;
        name = "Custom PC Build";
        description = "Build a PC to your specifications";
        price = 100.00;
        duration = "2-5 days";
      },
    );
    services.add(
      4,
      {
        id = 4;
        name = "Maintenance";
        description = "Cleaning and performance tuning";
        price = 40.00;
        duration = "Same day";
      },
    );
  };

  // Product CRUD
  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Float, category : Category, inStock : Bool) : async Nat {
    let id = nextProductId;
    let product : Product = {
      id;
      name;
      description;
      price;
      category;
      inStock;
    };
    products.add(id, product);
    nextProductId += 1;
    id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, description : Text, price : Float, category : Category, inStock : Bool) : async () {
    if (not products.containsKey(id)) { Runtime.trap("Product not found") };
    let product : Product = {
      id;
      name;
      description;
      price;
      category;
      inStock;
    };
    products.add(id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not products.containsKey(id)) { Runtime.trap("Product not found") };
    products.remove(id);
  };

  // Service CRUD
  public shared ({ caller }) func addService(name : Text, description : Text, price : Float, duration : Text) : async Nat {
    let id = nextServiceId;
    let service : Service = {
      id;
      name;
      description;
      price;
      duration;
    };
    services.add(id, service);
    nextServiceId += 1;
    id;
  };

  public shared ({ caller }) func updateService(id : Nat, name : Text, description : Text, price : Float, duration : Text) : async () {
    if (not services.containsKey(id)) { Runtime.trap("Service not found") };
    let service : Service = {
      id;
      name;
      description;
      price;
      duration;
    };
    services.add(id, service);
  };

  public shared ({ caller }) func deleteService(id : Nat) : async () {
    if (not services.containsKey(id)) { Runtime.trap("Service not found") };
    services.remove(id);
  };

  // Public functions
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    let filtered = products.values().toArray().filter(
      func(p) { p.category == category }
    );
    filtered.sort();
  };

  public query ({ caller }) func getAllServices() : async [Service] {
    services.values().toArray().sort();
  };

  public query ({ caller }) func getShopInfo() : async ShopInfo {
    shopInfo;
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getService(id : Nat) : async Service {
    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) { service };
    };
  };

  public func resetData() : async () {
    products.clear();
    services.clear();
    nextProductId := 7;
    nextServiceId := 5;
    await seedData();
  };
};
