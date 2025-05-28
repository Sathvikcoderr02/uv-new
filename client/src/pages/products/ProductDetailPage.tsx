import React, { useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import config from '@/config';

interface ProductVariant {
  id: number;
  color: string;
  size: string;
  sellingPrice: string | number;
  mrp: string | number;
  inventoryQuantity: number;
  imageUrl: string | null;
  isDefault: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  selling_price: string | number;
  mrp: string | number;
  featured_image_url: string;
  is_featured: boolean;
  inventory_quantity: number;
  status: string;
  variants: ProductVariant[];
}

export default function ProductDetailPage() {
  const [, params] = useRoute('/products/:id');
  const productId = params?.id;
  const [, navigate] = useLocation();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log(`Fetching product from: ${config.apiBaseUrl}/api/products/${productId}`);
        console.log('Current environment:', process.env.NODE_ENV);
        console.log('API Base URL:', config.apiBaseUrl);
        
        // First check if API is accessible
        try {
          const healthCheck = await axios.get(`${config.apiBaseUrl}/health`);
          console.log('API health check:', healthCheck.data);
        } catch (healthErr) {
          console.error('API health check failed:', healthErr);
          // Continue anyway to see specific product errors
        }
        
        // Fetch product details with timeout and headers
        const productResponse = await axios.get(`${config.apiBaseUrl}/api/products/${productId}`, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        const productData = productResponse.data;
        console.log('Product data received:', productData);
        
        // Fetch product variants
        const variantsResponse = await axios.get(`${config.apiBaseUrl}/api/products/${productId}/variants`, {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        const variantsData = variantsResponse.data;
        console.log('Variant data received:', variantsData);
        
        // Combine product with its variants
        const fullProduct = {
          ...productData,
          variants: variantsData
        };
        
        setProduct(fullProduct);
        
        // Don't pre-select any variant, color or size
        setSelectedVariant(null);
        setSelectedColor(null);
        setSelectedSize(null);
        
        setLoading(false);
      } catch (err) {
        if (config.enableDebugLogs) {
          console.error('Error fetching product:', err);
          if (axios.isAxiosError(err)) {
            console.error('API Error Details:', {
              status: err.response?.status,
              data: err.response?.data,
              headers: err.response?.headers
            });
          }
        }
        
        setError(`Failed to load product details. Please try again later. ${config.enableDebugLogs ? '(Check console for details)' : ''}`);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Get unique colors from variants
  const getUniqueColors = () => {
    if (!product) return [];
    const colors = product.variants.map(variant => variant.color);
    return [...new Set(colors)];
  };

  // Get unique sizes for the selected color
  const getUniqueSizes = () => {
    if (!product || !selectedColor) return [];
    const sizes = product.variants
      .filter(variant => variant.color === selectedColor)
      .map(variant => variant.size);
    return [...new Set(sizes)];
  };

  // Get all possible sizes across all variants
  const getAllSizes = () => {
    if (!product) return [];
    const sizes = product.variants.map(variant => variant.size);
    return [...new Set(sizes)];
  };

  // Check if a size is available for the selected color
  const isSizeAvailable = (size: string) => {
    if (!product || !selectedColor) return false;
    return product.variants.some(variant => 
      variant.color === selectedColor && 
      variant.size === size && 
      variant.inventoryQuantity > 0
    );
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
    setSelectedVariant(null);
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    if (!product || !selectedColor) return;
    
    const variant = product.variants.find(v => 
      v.color === selectedColor && 
      v.size === size
    );
    
    setSelectedSize(size);
    setSelectedVariant(variant || null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-md bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Failed to load product details
          </h2>
          <p className="text-gray-700 mb-4">
            We couldn't find the product you're looking for. It may have been removed or the link is incorrect.
          </p>
          <Link href="/">
            <Button>Return to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  // If the product has no variants at all
  if (product.variants.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline">&larr; Back to Home</Link>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">
            Product Variants Unavailable
          </h2>
          <p className="text-gray-700 mb-4">
            This product is currently unavailable in any variant. Please check back later.
          </p>
          <Link href="/">
            <Button>Browse Other Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Function to add the current product to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Clear any previous validation errors
    setValidationError(null);
    
    // Check if both color and size are selected
    if (!selectedColor) {
      setValidationError("Please select a color");
      return;
    }
    
    if (!selectedSize) {
      setValidationError("Please select a size");
      return;
    }
    
    // Get the selected variant
    const variant = selectedVariant;
    if (!variant) {
      setValidationError("Selected variant not available");
      return;
    }
    
    // Add to cart logic
    const cartItem = {
      id: product.id,
      variantId: variant.id,
      name: product.name,
      color: selectedColor,
      size: selectedSize,
      price: variant.sellingPrice,
      image: variant.imageUrl || product.featured_image_url,
      quantity: quantity
    };
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
      item.id === cartItem.id && 
      item.variantId === cartItem.variantId
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if it doesn't exist
      cart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event to update cart icon
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Show success message
    setAddedToCart(true);
    
    // Reset success message after a few seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 5000);
  };
  
  // Function to buy now (add to cart and go to cart page)
  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/cart.html';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="text-primary hover:underline">&larr; Back to Home</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="aspect-square relative">
            <img 
              src={selectedColor && product.id === 14 ? 
                `/images/products/${product.id}_${selectedColor.toLowerCase()}.jpg` : 
                (selectedVariant?.imageUrl || product.featured_image_url)} 
              alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ''}`}
              className="w-full h-full object-cover" 
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Product+Image';
              }}
            />
            {product.is_featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full">FEATURED</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="mb-4">
            {selectedVariant ? (
              <>
                <span className="text-2xl font-bold text-primary">${selectedVariant.sellingPrice}</span>
                {selectedVariant.mrp && Number(selectedVariant.mrp) > Number(selectedVariant.sellingPrice) && (
                  <span className="text-sm text-gray-500 line-through ml-2">${selectedVariant.mrp}</span>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">${product.selling_price}</span>
            )}
          </div>
          
          {/* Variant Selection */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              {/* Color Selection */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <RadioGroup value={selectedColor || ""} onValueChange={handleColorSelect} className="flex gap-2">
                  {getUniqueColors().map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <RadioGroupItem value={color} id={`color-${color}`} />
                      <Label htmlFor={`color-${color}`} className="capitalize">{color}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Size Selection */}
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <RadioGroup 
                  value={selectedSize || ""} 
                  onValueChange={handleSizeSelect} 
                  className="flex flex-wrap gap-2"
                  disabled={!selectedColor}
                >
                  {getAllSizes().map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={size} 
                        id={`size-${size}`} 
                        disabled={!selectedColor || !isSizeAvailable(size)}
                      />
                      <Label 
                        htmlFor={`size-${size}`} 
                        className={`uppercase ${!selectedColor || !isSizeAvailable(size) ? 'line-through text-gray-400' : ''}`}
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Availability */}
              <div className="mb-4">
                <p className="text-sm">
                  Availability: 
                  {selectedVariant ? (
                    selectedVariant.inventoryQuantity > 0 ? (
                      <span className="text-green-600 font-medium ml-1">In Stock</span>
                    ) : (
                      <span className="text-red-600 font-medium ml-1">Out of Stock</span>
                    )
                  ) : (
                    <span className="text-red-600 font-medium ml-1">Out of Stock</span>
                  )}
                </p>
                {selectedVariant && selectedVariant.inventoryQuantity > 0 && (
                  <p className="text-sm text-gray-500">
                    Quantity Available: {selectedVariant.inventoryQuantity}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Product Description */}
          <div className="mb-6">
            <p className="text-gray-600">
              {product.description}
            </p>
          </div>
          
          {/* Quantity and Add to Cart */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="mr-4">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button 
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="px-3 py-1 border-r border-gray-300"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border-l border-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            
            {validationError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {validationError}
                </AlertDescription>
              </Alert>
            )}
            
            {addedToCart && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Item added to cart successfully!
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.inventoryQuantity <= 0}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              
              <Button 
                onClick={handleBuyNow}
                disabled={!selectedVariant || selectedVariant.inventoryQuantity <= 0}
                variant="outline"
                className="flex-1"
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Buy Now
              </Button>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="/cart.html" className="text-primary hover:underline flex items-center">
              Go to Cart <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Product Description Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <p className="text-gray-600">
          {product.description}
        </p>
      </div>
    </div>
  );
}
