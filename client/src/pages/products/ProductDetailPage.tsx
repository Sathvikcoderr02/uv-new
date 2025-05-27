import React, { useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

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
  sellingPrice: string | number;
  mrp: string | number;
  featuredImageUrl: string;
  isFeatured: boolean;
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
        // Fetch product details
        const productResponse = await axios.get(`/api/products/${productId}`);
        const productData = productResponse.data;
        
        // Fetch product variants
        const variantsResponse = await axios.get(`/api/products/${productId}/variants`);
        const variantsData = variantsResponse.data;
        
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
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // If product data is still loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // If there was an error loading the product
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline">&larr; Back to Home</Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            {error || 'Product not found'}
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
    
    if (!selectedVariant) {
      setValidationError("Please select a valid color and size combination");
      return;
    }
    
    // Get current cart from localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if this variant is already in the cart
    const existingItemIndex = currentCart.findIndex(
      (item: any) => item.variantId === selectedVariant.id
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      currentCart.push({
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        price: selectedVariant.sellingPrice,
        color: selectedVariant.color,
        size: selectedVariant.size,
        imageUrl: selectedVariant.imageUrl || product.featuredImageUrl,
        quantity: quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Dispatch custom event to update cart counter
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Show success message and set added to cart state
    setAddedToCart(true);
    
    // Show toast notification
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} (${selectedVariant.color}, ${selectedVariant.size}) added to your cart.`,
      duration: 3000
    });
    
    // Auto-hide the success message after 5 seconds
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
              src={selectedVariant?.imageUrl || product.featuredImageUrl} 
              alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ''}`}
              className="w-full h-full object-cover" 
            />
            {product.isFeatured && (
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
              <span className="text-2xl font-bold text-primary">${product.sellingPrice}</span>
            )}
          </div>
          
          {/* Variant Selection */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Color</h3>
              <RadioGroup 
                value={selectedColor || ''} 
                onValueChange={(value) => {
                  setSelectedColor(value);
                  // Find a variant with this color and the currently selected size (if any)
                  const newVariant = product.variants.find(v => 
                    v.color === value && (selectedSize ? v.size === selectedSize : true)
                  );
                  if (newVariant) {
                    setSelectedVariant(newVariant);
                    setSelectedSize(newVariant.size);
                  } else if (selectedSize) {
                    // If no variant with this color and the current size exists, just set the first variant with this color
                    const firstVariantWithColor = product.variants.find(v => v.color === value);
                    if (firstVariantWithColor) {
                      setSelectedVariant(firstVariantWithColor);
                      setSelectedSize(firstVariantWithColor.size);
                    }
                  }
                  // Clear validation error when user selects a color
                  setValidationError(null);
                }}
                className="flex gap-2 mb-4"
              >
                {Array.from(new Set(product.variants.map(v => v.color))).map(color => (
                  <div key={color} className="flex items-center space-x-2">
                    <RadioGroupItem value={color} id={`color-${color}`} />
                    <Label htmlFor={`color-${color}`} className="cursor-pointer">{color}</Label>
                  </div>
                ))}
              </RadioGroup>
              
              {/* Size selection */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-3">Size</h3>
                <RadioGroup 
                  value={selectedSize || ''} 
                  onValueChange={(value) => {
                    setSelectedSize(value);
                    // Find a variant with the selected color and this size
                    if (selectedColor) {
                      const newVariant = product.variants.find(v => 
                        v.color === selectedColor && v.size === value
                      );
                      if (newVariant) {
                        setSelectedVariant(newVariant);
                      }
                    }
                    // Clear validation error when user selects a size
                    setValidationError(null);
                  }}
                  className="flex gap-2"
                >
                    {/* Show all possible sizes - S, M, L, XL, XXL with strikethrough for unavailable */}
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                      // Check if this size exists with the selected color
                      const exists = selectedColor ? 
                        product.variants.some(v => v.color === selectedColor && v.size === size) : 
                        product.variants.some(v => v.size === size);
                      
                      return (
                        <div key={size} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={size} 
                            id={`size-${size}`} 
                            disabled={!exists} 
                          />
                          <Label 
                            htmlFor={`size-${size}`} 
                            className={`cursor-pointer ${!exists ? 'text-gray-400 line-through' : ''}`}
                          >
                            {size}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-1">
                  Availability: 
                  <span className={`font-medium ${selectedVariant ? (selectedVariant.inventoryQuantity > 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-600'}`}>
                    {selectedVariant ? (selectedVariant.inventoryQuantity > 0 ? ' In Stock' : ' Out of Stock') : ' Select options'}
                  </span>
                </p>
                {selectedVariant && (
                  <p className="text-sm text-gray-600">
                    Quantity Available: <span className="font-medium">{selectedVariant.inventoryQuantity}</span>
                  </p>
                )}
              </div>
            </div>
          )}
          
          <div className="border-t border-b border-gray-200 py-4 my-6">
            <p className="text-gray-700 mb-4">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded overflow-hidden">
              <button 
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200" 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1 || !selectedVariant}
              >
                -
              </button>
              <span className="px-3 py-1">{quantity}</span>
              <button 
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200" 
                onClick={() => setQuantity(prev => selectedVariant ? Math.min(selectedVariant.inventoryQuantity, prev + 1) : prev)}
                disabled={!selectedVariant || (selectedVariant && quantity >= selectedVariant.inventoryQuantity)}
              >
                +
              </button>
            </div>
          </div>

          {/* Success message when item is added to cart */}
          {addedToCart && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <AlertDescription className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {quantity} × {product.name} ({selectedColor}, {selectedSize}) added to your cart!
                </span>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Validation error message */}
          {validationError && (
            <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
              <AlertDescription className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{validationError}</span>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex space-x-4 mt-6">
            <Button 
              className="px-8 py-6" 
              size="lg" 
              disabled={!selectedVariant || selectedVariant.inventoryQuantity <= 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              className="px-8 py-6" 
              size="lg"
              disabled={!selectedVariant || selectedVariant.inventoryQuantity <= 0}
              onClick={handleBuyNow}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Buy Now
            </Button>
          </div>
          
          {/* Go to Cart button */}
          <div className="mt-4">
            <a 
              href="/cart.html" 
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Go to Cart <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Product Description</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
