const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Define models directly to avoid import routing issues
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["admin", "seller", "customer"], default: "customer" },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  phone: { type: String },
  image: { type: String },
  address: {
    shippingAddress: { type: String },
    billingAddress: { type: String }
  }
}, { timestamps: true });
const User = mongoose.model("User", UserSchema);

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  logo: { type: String, required: false },
}, { timestamps: true });
const Brand = mongoose.model("Brand", BrandSchema);

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Category", default: null },
  image: String,
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
}, { timestamps: true });
const Category = mongoose.model("Category", CategorySchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categories: [{ type: mongoose.Types.ObjectId, ref: "Category", required: true }],
  brand: { type: mongoose.Types.ObjectId, ref: "Brand" },
  description: { type: String, required: true },
  costPrice: { type: Number, min: 0 },
  price: { type: Number, min: 1 },
  discount: { type: Number, min: 0, max: 100 },
  afterDiscount: { type: Number },
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  sellerId: { type: mongoose.Types.ObjectId, ref: "User" },
  stock: { type: Number, required: true },
  images: [{ type: String }],
}, { timestamps: true });
const Product = mongoose.model("Product", ProductSchema);

// Base64 of a tiny 1x1 transparent PNG
const dummyPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const dummyBuffer = Buffer.from(dummyPngBase64, "base64");

const writeDummyFile = (subFolder, filename) => {
  const dirPath = path.join(__dirname, "public", "uploads", subFolder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, filename);
  fs.writeFileSync(filePath, dummyBuffer);
};

const runSeed = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
    const dbName = process.env.MONGODB_NAME || "express";
    
    console.log(`Connecting to MongoDB at ${mongoUrl} (db: ${dbName})...`);
    await mongoose.connect(mongoUrl, { dbName });
    console.log("Connected successfully.");

    // Clear existing collections
    console.log("Clearing existing collections...");
    await User.deleteMany({});
    await Brand.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Collections cleared.");

    // Seed Users
    console.log("Seeding Users...");
    const plainPassword = "admin@123";
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);
    
    const usersData = [
      {
        name: "System Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
        status: "active",
        phone: "9876543210",
        image: "admin.png",
        address: { shippingAddress: "Kathmandu", billingAddress: "Kathmandu" }
      },
      {
        name: "Buyer One",
        email: "buyer1@gmail.com",
        password: hashedPassword,
        role: "customer",
        status: "active",
        phone: "9876543211",
        image: "buyer1.png",
        address: { shippingAddress: "Lalitpur", billingAddress: "Lalitpur" }
      },
      {
        name: "Buyer Two",
        email: "buyer2@gmail.com",
        password: hashedPassword,
        role: "customer",
        status: "active",
        phone: "9876543212",
        image: "buyer2.png",
        address: { shippingAddress: "Bhaktapur", billingAddress: "Bhaktapur" }
      },
      {
        name: "Seller One",
        email: "seller1@gmail.com",
        password: hashedPassword,
        role: "seller",
        status: "active",
        phone: "9876543213",
        image: "seller1.png",
        address: { shippingAddress: "Pokhara", billingAddress: "Pokhara" }
      },
      {
        name: "Seller Two",
        email: "seller2@gmail.com",
        password: hashedPassword,
        role: "seller",
        status: "active",
        phone: "9876543214",
        image: "seller2.png",
        address: { shippingAddress: "Chitwan", billingAddress: "Chitwan" }
      }
    ];

    const users = {};
    for (const u of usersData) {
      writeDummyFile("users", u.image);
      const createdUser = await User.create(u);
      users[u.email] = createdUser._id;
    }
    console.log(`Successfully seeded ${Object.keys(users).length} Users (Password: ${plainPassword}).`);

    // Seed Brands
    console.log("Seeding Brands...");
    const brandData = [
      { name: "Apple", slug: "apple", logo: "apple.png", status: "active" },
      { name: "Samsung", slug: "samsung", logo: "samsung.png", status: "active" },
      { name: "Nike", slug: "nike", logo: "nike.png", status: "active" },
      { name: "Sony", slug: "sony", logo: "sony.png", status: "active" },
      { name: "Dell", slug: "dell", logo: "dell.png", status: "active" },
      { name: "Adidas", slug: "adidas", logo: "adidas.png", status: "active" },
      { name: "Puma", slug: "puma", logo: "puma.png", status: "active" },
      { name: "Asus", slug: "asus", logo: "asus.png", status: "active" }
    ];

    const brands = {};
    for (const b of brandData) {
      writeDummyFile("brands", b.logo);
      const createdBrand = await Brand.create(b);
      brands[b.name] = createdBrand._id;
    }
    console.log(`Successfully seeded ${Object.keys(brands).length} Brands.`);

    // Seed Categories & Subcategories
    console.log("Seeding Categories...");
    const parentCategories = [
      { name: "Electronics", slug: "electronics", image: "electronics.png", status: "active" },
      { name: "Fashion", slug: "fashion", image: "fashion.png", status: "active" },
      { name: "Sports", slug: "sports", image: "sports.png", status: "active" },
      { name: "Home & Living", slug: "home-living", image: "home-living.png", status: "active" }
    ];

    const categories = {};
    for (const cat of parentCategories) {
      writeDummyFile("category", cat.image);
      const createdCat = await Category.create(cat);
      categories[cat.name] = createdCat._id;
    }

    const subCategories = [
      { name: "Laptops", slug: "laptops", parentName: "Electronics", image: "laptops.png", status: "active" },
      { name: "Smartphones", slug: "smartphones", parentName: "Electronics", image: "smartphones.png", status: "active" },
      { name: "Shoes", slug: "shoes", parentName: "Fashion", image: "shoes.png", status: "active" },
      { name: "Clothing", slug: "clothing", parentName: "Fashion", image: "clothing.png", status: "active" }
    ];

    for (const sub of subCategories) {
      writeDummyFile("category", sub.image);
      const createdSub = await Category.create({
        name: sub.name,
        slug: sub.slug,
        parent: categories[sub.parentName],
        image: sub.image,
        status: sub.status
      });
      categories[sub.name] = createdSub._id;
    }
    console.log(`Successfully seeded ${Object.keys(categories).length} Categories.`);

    // Seed Products (Associated with Sellers)
    console.log("Seeding Products...");
    const productData = [
      {
        name: "iPhone 15 Pro",
        slug: "iphone-15-pro",
        brand: brands["Apple"],
        categories: [categories["Electronics"], categories["Smartphones"]],
        description: "Latest Apple iPhone with titanium design, A17 Pro chip and dynamic island.",
        costPrice: 120000,
        price: 150000,
        discount: 10,
        afterDiscount: 135000,
        status: "active",
        sellerId: users["seller1@gmail.com"],
        stock: 25,
        images: ["iphone.png"]
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        brand: brands["Samsung"],
        categories: [categories["Electronics"], categories["Smartphones"]],
        description: "Samsung flagship smartphone with AI translation, nightography camera, and S-Pen.",
        costPrice: 110000,
        price: 145000,
        discount: 8,
        afterDiscount: 133400,
        status: "active",
        sellerId: users["seller1@gmail.com"],
        stock: 18,
        images: ["galaxy.png"]
      },
      {
        name: "Dell XPS 13 Plus",
        slug: "dell-xps-13-plus",
        brand: brands["Dell"],
        categories: [categories["Electronics"], categories["Laptops"]],
        description: "Ultra-thin and lightweight high-performance developer laptop with 4K OLED touch screen.",
        costPrice: 140000,
        price: 180000,
        discount: 0,
        afterDiscount: null,
        status: "active",
        sellerId: users["seller2@gmail.com"],
        stock: 10,
        images: ["dellxps.png"]
      },
      {
        name: "Sony WH-1000XM5 Wireless Headphones",
        slug: "sony-wh-1000xm5",
        brand: brands["Sony"],
        categories: [categories["Electronics"]],
        description: "Industry leading noise-canceling wireless over-ear headphones with premium smart sound controls.",
        costPrice: 280000,
        price: 36000,
        discount: 15,
        afterDiscount: 30600,
        status: "active",
        sellerId: users["seller2@gmail.com"],
        stock: 35,
        images: ["sonyheadphones.png"]
      },
      {
        name: "Nike Air Max Runner",
        slug: "nike-air-max-runner",
        brand: brands["Nike"],
        categories: [categories["Fashion"], categories["Shoes"]],
        description: "Modern lifestyle running shoes featuring cushioned sole support and lightweight breathable mesh.",
        costPrice: 9000,
        price: 15000,
        discount: 20,
        afterDiscount: 12000,
        status: "active",
        sellerId: users["seller1@gmail.com"],
        stock: 50,
        images: ["nikeshoes.png"]
      },
      {
        name: "Adidas Ultraboost 1.0",
        slug: "adidas-ultraboost-1-0",
        brand: brands["Adidas"],
        categories: [categories["Fashion"], categories["Shoes"]],
        description: "Premium sports shoes with energy returning boost midsole tech and lightweight Primeknit upper.",
        costPrice: 11000,
        price: 18500,
        discount: 12,
        afterDiscount: 16280,
        status: "active",
        sellerId: users["seller2@gmail.com"],
        stock: 40,
        images: ["adidasultraboost.png"]
      }
    ];

    for (const p of productData) {
      for (const img of p.images) {
        writeDummyFile("products", img);
      }
      await Product.create(p);
    }
    console.log(`Successfully seeded ${productData.length} Products.`);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seed execution:", error);
  } finally {
    mongoose.connection.close();
  }
};

runSeed();
