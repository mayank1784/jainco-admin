import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import DefaultLayout from '../layout/DefaultLayout';

// const Tables = () => {
//   return (
//     <DefaultLayout>
//       <Breadcrumb pageName="Tables" />

//       <div className="flex flex-col gap-10">
//         <TableOne />
//         <TableTwo />
//         <TableThree />
//       </div>
//     </DefaultLayout>
//   );
// };

// export default Tables;
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: '',
    description: '',
    category: '',
    lowerPrice: '',
    upperPrice: '',
    mainImage: '',
    otherImages: [],
  });
  const [newCategory, setNewCategory] = useState('');
  const [variations, setVariations] = useState([]);
  const [variationTitle, setVariationTitle] = useState('');
  const [variationValues, setVariationValues] = useState({});
  const [newVariationValue, setNewVariationValue] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products'));
    if (savedProducts) {
      setProducts(savedProducts);
    }

    const savedProductDetails = JSON.parse(localStorage.getItem('productDetails'));
    if (savedProductDetails) {
      setProductDetails(savedProductDetails);
    }

    const savedVariations = JSON.parse(localStorage.getItem('variations'));
    if (savedVariations) {
      setVariations(savedVariations);
    }

    const savedVariationValues = JSON.parse(localStorage.getItem('variationValues'));
    if (savedVariationValues) {
      setVariationValues(savedVariationValues);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('productDetails', JSON.stringify(productDetails));
  }, [productDetails]);

  useEffect(() => {
    localStorage.setItem('variations', JSON.stringify(variations));
  }, [variations]);

  useEffect(() => {
    localStorage.setItem('variationValues', JSON.stringify(variationValues));
  }, [variationValues]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductDetails((prev) => ({
        ...prev,
        mainImage: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleOtherImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    const images = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        images.push(reader.result);
        if (images.length === files.length) {
          setProductDetails((prev) => ({
            ...prev,
            otherImages: images,
          }));
        }
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  };

  const handleAddVariation = () => {
    if (variationTitle && !variations.includes(variationTitle)) {
      setVariations((prev) => [...prev, variationTitle]);
      setVariationValues((prev) => ({
        ...prev,
        [variationTitle]: [],
      }));
      setVariationTitle('');
    }
  };

  const handleAddVariationValue = (title, value) => {
    if (value && !variationValues[title].includes(value)) {
      setVariationValues((prev) => ({
        ...prev,
        [title]: [...prev[title], value],
      }));
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: uuidv4(),
      ...productDetails,
      variations: variationValues,
    };
    setProducts((prev) => [...prev, newProduct]);
    setProductDetails({
      name: '',
      description: '',
      category: '',
      lowerPrice: '',
      upperPrice: '',
      mainImage: '',
      otherImages: [],
    });
    setVariations([]);
    setVariationValues({});
    // Clear the product form data from localStorage after submission
    localStorage.removeItem('productDetails');
    localStorage.removeItem('variations');
    localStorage.removeItem('variationValues');
  };

  const generateCombinations = (obj) => {
    const keys = Object.keys(obj);
    const result = [];

    const helper = (index, current) => {
      if (index === keys.length) {
        result.push(current);
        return;
      }
      obj[keys[index]].forEach((value) => {
        helper(index + 1, { ...current, [keys[index]]: value });
      });
    };

    helper(0, {});
    return result;
  };

  const renderTable = () => {
    if (variations.length === 0) return null;

    const combinations = generateCombinations(variationValues);

    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.no</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            {variations.map((variation) => (
              <th key={variation} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{variation}</th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Available</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {combinations.map((combination, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img src={productDetails.mainImage} alt="Product" className="w-10 h-10 object-cover" />
              </td>
              {variations.map((variation) => (
                <td key={variation} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{combination[variation]}</td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" defaultChecked className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={productDetails.name}
            onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={productDetails.description}
            onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <div className="flex">
            <select
              value={productDetails.category}
              onChange={(e) => setProductDetails({ ...productDetails, category: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              {Array.from(new Set(products.map((product) => product.category))).map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
              {newCategory && <option value={newCategory}>{newCategory}</option>}
            </select>
            <input
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mt-1 ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lower Price</label>
          <input
            type="number"
            value={productDetails.lowerPrice}
            onChange={(e) => setProductDetails({ ...productDetails, lowerPrice: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upper Price</label>
          <input
            type="number"
            value={productDetails.upperPrice}
            onChange={(e) => setProductDetails({ ...productDetails, upperPrice: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Main Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="mt-1 block w-full text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Other Images</label>
          <input
            type="file"
            multiple
            onChange={handleOtherImagesUpload}
            className="mt-1 block w-full text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Variations</label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Variation Title"
              value={variationTitle}
              onChange={(e) => setVariationTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddVariation}
              className="mt-1 block bg-blue-500 text-white px-3 py-2 rounded-md"
            >
              Add Variation
            </button>
          </div>
          {variations.map((variation) => (
            <div key={variation} className="mt-2">
              <label className="block text-sm font-medium text-gray-700">{variation}</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder={`Add value to ${variation}`}
                  value={newVariationValue[variation] || ''}
                  onChange={(e) => setNewVariationValue({ ...newVariationValue, [variation]: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleAddVariationValue(variation, newVariationValue[variation]);
                    setNewVariationValue({ ...newVariationValue, [variation]: '' });
                  }}
                  className="mt-1 block bg-green-500 text-white px-3 py-2 rounded-md"
                >
                  Add Value
                </button>
              </div>
              <div className="mt-1">
                {variationValues[variation] && variationValues[variation].map((value) => (
                  <span key={value} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{value}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          <button
            type="submit"
            className="mt-1 block bg-indigo-500 text-white px-3 py-2 rounded-md"
          >
            Add Product
          </button>
        </div>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Product Variations</h2>
        {renderTable()}
      </div>
    </div>
    </DefaultLayout>
  );
};

export default ProductForm;
