import React, { useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ShoppingBag, ArrowRight, Heart, Star, ChevronLeft, Menu } from "lucide-react";
import { Link } from "wouter";
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
  // Support both camelCase and snake_case property names
  sellingPrice?: string | number;
  selling_price?: string | number;
  mrp: string | number;
  inventoryQuantity?: number;
  inventory_quantity?: number;
  imageUrl?: string | null;
  image_url?: string | null;
  isDefault?: boolean;
  is_default?: boolean;
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

// Cart Counter Component
function CartCounter() {
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Function to update cart count
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((total: number, item: any) => total + (item.quantity || 0), 0);
        setCartItemCount(count);
      } catch (error) {
        console.error('Error reading cart from localStorage:', error);
        setCartItemCount(0);
      }
    };

    // Update count on mount
    updateCartCount();

    // Set up storage event listener to update count when cart changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };

    // Listen for storage events (when cart is updated from another tab)
    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab updates
    const handleCustomEvent = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCustomEvent);
    };
  }, []);

  if (cartItemCount <= 0) return null;
  
  return (
    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {cartItemCount > 99 ? '99+' : cartItemCount}
    </span>
  );
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
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
        let variantsData = variantsResponse.data;
        console.log('Raw variant data received:', variantsData);
        
        // Check if we have the Allen Solly product (ID 14)
        if (productId === '14') {
          console.log('Found Allen Solly product, checking variants');
          
          // Log each variant's properties
          variantsData.forEach((variant, index) => {
            console.log(`Allen Solly Variant ${index + 1}:`);
            console.log('  ID:', variant.id);
            console.log('  Color:', variant.color);
            console.log('  Size:', variant.size);
            console.log('  Image URL (image_url):', variant.image_url);
            console.log('  Image URL (imageUrl):', variant.imageUrl);
            console.log('  Selling Price (selling_price):', variant.selling_price);
            console.log('  Selling Price (sellingPrice):', variant.sellingPrice);
            console.log('  All properties:', Object.keys(variant));
          });
          
          // If the image URLs are missing, manually set them based on the database check
          const allenSollyImages = {
            'Black': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3',
            'Blue': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3',
            'White': 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3'
          };
          
          // Update the variants with the correct image URLs
          variantsData = variantsData.map(variant => {
            // If the variant doesn't have an image URL, set it based on the color
            if (!variant.image_url && !variant.imageUrl && variant.color && allenSollyImages[variant.color]) {
              console.log(`Setting image URL for ${variant.color} variant to:`, allenSollyImages[variant.color]);
              return {
                ...variant,
                image_url: allenSollyImages[variant.color],
                imageUrl: allenSollyImages[variant.color]
              };
            }
            return variant;
          });
          
          console.log('Updated Allen Solly variants:', variantsData);
        }
        
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

  // Get all unique colors from variants
  const getUniqueColors = () => {
    if (!product) return [];
    const colors = product.variants.map(variant => variant.color);
    return [...new Set(colors)];
  };
  
  // Get variant image for a specific color
  const getVariantImageForColor = (color: string) => {
    if (!product) return null;
    
    // Find a variant with this color
    const variant = product.variants.find(v => v.color === color);
    
    // For Allen Solly products, use hardcoded images
    if (product.id === 14) {
      const allenSollyImages: Record<string, string> = {
        'Black': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3',
        'Blue': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3',
        'White': 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3'
      };
      
      if (color in allenSollyImages) {
        return allenSollyImages[color as keyof typeof allenSollyImages];
      }
    }
    
    // Return variant image or null
    return variant?.imageUrl || variant?.image_url || null;
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
    
    // Always return true if the variant exists, regardless of inventory
    return product.variants.some(variant => 
      variant.color === selectedColor && 
      variant.size === size
    );
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    console.log(`Selecting color: ${color}`);
    setSelectedColor(color);
    setSelectedSize(null); // Reset size when color changes
    
    // Find a variant with the selected color
    const variant = product?.variants.find(v => v.color === color);
    if (variant) {
      console.log('Selected variant:', variant);
      
      // Create a normalized variant to ensure all properties are available
      const normalizedVariant = {
        ...variant,
        // Ensure both property formats are available
        imageUrl: variant.imageUrl || variant.image_url,
        image_url: variant.image_url || variant.imageUrl,
        sellingPrice: variant.sellingPrice || variant.selling_price,
        selling_price: variant.selling_price || variant.sellingPrice
      };
      
      // Update the selected variant to display the price
      setSelectedVariant(normalizedVariant);
    } else {
      console.log('No variant found for color:', color);
      setSelectedVariant(null);
    }
  };
  
  // Handle color hover
  const handleColorMouseEnter = (color: string) => {
    console.log('Mouse enter on color:', color);
    setHoveredColor(color);
  };
  
  // Handle mouse leave
  const handleColorMouseLeave = () => {
    console.log('Mouse leave from color');
    setHoveredColor(null);
  };
  
  // Get the image to display based on selected or hovered color
  const getDisplayImage = () => {
    if (!product) return '/images/placeholder-product.jpg';
    
    // If a color is being hovered, show that color's image
    if (hoveredColor) {
      console.log('Using hovered color for image:', hoveredColor);
      // For Allen Solly products, use hardcoded images
      if (product.id === 14) {
        const allenSollyImages: Record<string, string> = {
          'Black': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3',
          'Blue': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3',
          'White': 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3'
        };
        
        // Use type assertion to fix TypeScript error
        if (hoveredColor in allenSollyImages) {
          return allenSollyImages[hoveredColor as keyof typeof allenSollyImages];
        }
      }
      
      // Try to find a variant with the hovered color
      const hoveredVariant = product.variants.find(v => v.color === hoveredColor);
      if (hoveredVariant && (hoveredVariant.imageUrl || hoveredVariant.image_url)) {
        return hoveredVariant.imageUrl || hoveredVariant.image_url;
      }
    }
    
    // If no hover or no hover image found, use selected variant image
    if (selectedVariant && (selectedVariant.imageUrl || selectedVariant.image_url)) {
      return selectedVariant.imageUrl || selectedVariant.image_url;
    }
    
    // If selected color but no selected variant yet
    if (selectedColor) {
      // For Allen Solly products, use hardcoded images
      if (product.id === 14) {
        const allenSollyImages: Record<string, string> = {
          'Black': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3',
          'Blue': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3',
          'White': 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3'
        };
        
        // Use type assertion to fix TypeScript error
        if (selectedColor in allenSollyImages) {
          return allenSollyImages[selectedColor as keyof typeof allenSollyImages];
        }
      }
      
      // Try to find any variant with the selected color
      const colorVariant = product.variants.find(v => v.color === selectedColor);
      if (colorVariant && (colorVariant.imageUrl || colorVariant.image_url)) {
        return colorVariant.imageUrl || colorVariant.image_url;
      }
    }
    
    // Default to product featured image
    return product.featured_image_url || '/images/placeholder-product.jpg';
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    if (!product || !selectedColor) return;
    
    const variant = product.variants.find(v => 
      v.color === selectedColor && 
      v.size === size
    );
    
    setSelectedSize(size);
    
    if (variant) {
      // Create a normalized variant to ensure all properties are available
      const normalizedVariant = {
        ...variant,
        // Ensure both property formats are available
        imageUrl: variant.imageUrl || variant.image_url,
        image_url: variant.image_url || variant.imageUrl,
        sellingPrice: variant.sellingPrice || variant.selling_price,
        selling_price: variant.selling_price || variant.sellingPrice
      };
      
      // Update the selected variant to display the price
      setSelectedVariant(normalizedVariant);
      console.log('Selected variant with size:', normalizedVariant);
    } else {
      setSelectedVariant(null);
      console.log('No variant found for size:', size);
    }
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
    // Make sure we use the correct image URL for the variant - use the same logic as getVariantImageForColor
    let variantImage;
    
    // For Allen Solly products (ID 14), use specific images based on color
    if (product.id === 14) {
      // Use the same hardcoded images as in the display
      const allenSollyImages: Record<string, string> = {
        'Black': 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3',
        'Blue': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3',
        'White': 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3'
      };
      
      // Use type assertion to fix TypeScript error
      if (selectedColor && selectedColor in allenSollyImages) {
        variantImage = allenSollyImages[selectedColor as keyof typeof allenSollyImages];
        console.log('Using hardcoded Allen Solly image for cart:', variantImage);
      }
    }
    
    // If not Allen Solly or no specific image found, use variant image or product image
    if (!variantImage) {
      // Try to use the same image that's displayed in the main product view
      variantImage = getDisplayImage();
      console.log('Using display image for cart:', variantImage);
    }
    
    console.log('Adding to cart with image URL:', variantImage);
    
    const cartItem = {
      id: product.id,
      variantId: variant.id,
      name: product.name,
      color: selectedColor,
      size: selectedSize,
      price: variant.sellingPrice || variant.selling_price,
      image: variantImage,
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
    
    // If validations pass, add to cart and redirect
    handleAddToCart();
    window.location.href = '/cart.html';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-gray-500 hover:text-gray-600">
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <h1 className="ml-4 text-xl font-semibold text-gray-900 line-clamp-1">
                {product.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/cart.html" className="relative text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-6 w-6" />
                <CartCounter />
              </a>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <Link href="/" className="text-primary hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="text-primary hover:underline">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-500 line-clamp-1">{product.name}</span>
          </div>
        </div>
      </header>
      <div className="mb-6">
        <Link href="/" className="text-primary hover:underline">&larr; Back to Home</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image with Zoom */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div 
            className="aspect-square relative cursor-zoom-in overflow-hidden"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={(e) => {
              // Get the position of the cursor relative to the image container
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setMousePosition({ x, y });
            }}
          >
            <img 
              src={getDisplayImage()} 
              alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ''}`}
              className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              style={isZoomed ? {
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
              } : undefined}
              onError={(e) => {
                console.warn('Image failed to load, using fallback');
                e.currentTarget.src = '/images/placeholder-product.jpg';
                e.currentTarget.alt = 'Placeholder product image';
              }}
            />
            {product.is_featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full">FEATURED</span>
              </div>
            )}
            {isZoomed && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Hover to zoom
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
                <span className="text-2xl font-bold text-primary">${selectedVariant.sellingPrice || selectedVariant.selling_price}</span>
                {selectedVariant.mrp && Number(selectedVariant.mrp) > Number(selectedVariant.sellingPrice || selectedVariant.selling_price || 0) && (
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
              {/* Variant Image Selection */}
              <div className="mb-12">
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-4">
                  {getUniqueColors().map(color => {
                    const isSelected = color === selectedColor;
                    const variantImage = getVariantImageForColor(color) || product.featured_image_url;
                    
                    return (
                      <div 
                        key={color}
                        className={`relative cursor-pointer transition-all duration-200 ${isSelected ? 'transform scale-110' : ''}`}
                        onClick={() => handleColorSelect(color)}
                        onMouseEnter={() => handleColorMouseEnter(color)}
                        onMouseLeave={handleColorMouseLeave}
                        style={{ marginBottom: '30px' }} // Add space for the color name below
                      >
                        <div 
                          className={`w-16 h-16 rounded-md overflow-hidden border-2 ${isSelected ? 'border-primary' : 'border-gray-300'}`}
                          onMouseEnter={() => handleColorMouseEnter(color)}
                          onMouseLeave={handleColorMouseLeave}
                        >
                          <img 
                            src={variantImage} 
                            alt={`${product.name} - ${color}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder-product.jpg';
                            }}
                          />
                        </div>
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs capitalize text-center">
                          {color}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mt-8 mb-4">
                <h3 className="text-sm font-medium mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {getAllSizes().map((size: string) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeSelect(size)}
                      disabled={!selectedColor || !isSizeAvailable(size)}
                      className={`
                        w-12 h-12 flex items-center justify-center rounded-md border-2 text-sm font-medium
                        ${selectedSize === size 
                          ? 'border-orange-500 bg-orange-50 text-orange-700' 
                          : 'border-gray-200 hover:border-orange-300'}
                        ${!isSizeAvailable(size) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        transition-colors duration-200
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Availability */}
              <div className="mb-4">
                <p className="text-sm">
                  Availability: 
                  <span className="text-green-600 font-medium ml-1">In Stock</span>
                </p>
                {selectedVariant && (
                  <p className="text-sm text-gray-500">
                    Quantity Available: Multiple sizes and colors available
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
                disabled={!selectedVariant}
                className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-700 hover:text-amber-900 border border-amber-300"
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              
              <Button 
                onClick={handleBuyNow}
                disabled={!selectedVariant}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Buy Now
              </Button>
            </div>
          </div>
          
          {/* Go to Cart link removed as requested */}
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
