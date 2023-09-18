class ProductStoreTransformer {
  _data;
  _files;
  constructor(req) {
    this._data = req.body;
    this._files = req.files;
  }
  transformData = () => {
    let data = { ...this._data };
    // let isSlugExists = await productServiceObj.checkIfSlugExists(productSlug);
    // productData.logo = this._data.file?.filename;
    if (this._files) {
      let images = [];
      this._files.map((item) => {
        images.push(item.filename);
      });
      data.images = images;
    }
    data.costPrice = Number(data.costPrice);
    data.price = Number(data.price);
    data.discount = Number(data.discount);
    if (data?.discount !== 0) {
      data.afterDiscount = Number(
        data.price - (data.discount / 100) * data.price
      );
    } else {
      data.afterDiscount = null;
    }
    if (
      !this._data.categories ||
      this._data.categories === "null" ||
      this._data.categories === null
    ) {
      data.categories = null;
    } else {
      if (typeof this._data.categories === "string") {
        data.categories = this._data.categories.split(",");
      }
    }
    if (
      !this._data.brand ||
      this._data.brand === "null" ||
      this._data.brand === null
    ) {
      data.brand = null;
    }
    if (
      !this._data.sellerId ||
      this._data.sellerId === "null" ||
      this._data.sellerId === null
    ) {
      data.sellerId = null;
    }
    console.log(data);
    return data;
  };
}
// const productStoreTransformerObj = new ProductStoreTransformer();
module.exports = ProductStoreTransformer;
