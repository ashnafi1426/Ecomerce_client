import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { customerAPI } from '../../services/api.service';

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [todaysDeals, setTodaysDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visibleDeals, setVisibleDeals] = useState(12);
  const [visibleBestSellers, setVisibleBestSellers] = useState(12);
  const [visibleNewArrivals, setVisibleNewArrivals] = useState(12);
  const [visibleRecommended, setVisibleRecommended] = useState(12);
  const [visibleTrending, setVisibleTrending] = useState(12);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  // Helper functions - defined before use
  const getCategoryImage = (categoryName) => {
    const imageMap = {
      'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=500&fit=crop&crop=center',
      'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=500&fit=crop&crop=center',
      'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop&crop=center',
      'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=500&fit=crop&crop=center',
      'Home & Garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=500&fit=crop&crop=center',
      'Books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=500&fit=crop&crop=center',
      'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop&crop=center',
      'Sports & Outdoors': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop&crop=center',
      'Toys': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200&h=500&fit=crop&crop=center',
      'Toys & Games': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=500&fit=crop&crop=center',
      'Gold': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=500&fit=crop&crop=center',
      'Test Review Category': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=500&fit=crop&crop=center'
    };
    return imageMap[categoryName] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=500&fit=crop&crop=center';
  };

  const getCategoryCardImage = (categoryName) => {
    const imageMap = {
      'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop&crop=center',
      'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center',
      'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center',
      'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
      'Home & Garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center',
      'Books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center',
      'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
      'Sports & Outdoors': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
      'Toys': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop&crop=center',
      'Toys & Games': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&crop=center',
      'Gold': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&crop=center',
      'Test Review Category': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center'
    };
    return imageMap[categoryName] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center';
  };

  const getCategoryEmoji = (categoryName) => {
    const emojiMap = {
      'Electronics': '💻',
      'Fashion': '👗',
      'Clothing': '👕',
      'Home & Kitchen': '🏠',
      'Home & Garden': '🏡',
      'Books': '📚',
      'Sports': '⚽',
      'Sports & Outdoors': '🏃',
      'Toys': '🧸',
      'Toys & Games': '🎮',
      'Gold': '💍'
    };
    return emojiMap[categoryName] || '📦';
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  };

  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Create dynamic carousel slides based on available categories (using useMemo to avoid re-creation)
  const carouselSlides = React.useMemo(() => {
    if (categories.length === 0) {
      return [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
          title: "Fashion Sale",
          subtitle: "Up to 70% off on trending fashion",
          buttonText: "Shop Fashion",
          categoryName: 'Fashion'
        },
        {
          id: 2,
          image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop",
          title: "Electronics Deal",
          subtitle: "Latest gadgets at best prices",
          buttonText: "Shop Electronics",
          categoryName: 'Electronics'
        },
        {
          id: 3,
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop",
          title: "Home & Kitchen",
          subtitle: "Transform your home today",
          buttonText: "Shop Home",
          categoryName: 'Home & Kitchen'
        },
        {
          id: 4,
          image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop",
          title: "Books & More",
          subtitle: "Expand your knowledge",
          buttonText: "Shop Books",
          categoryName: 'Books'
        }
      ];
    }

    // Create slides from actual categories
    return categories.slice(0, 4).map((category) => {
      const productCount = allProducts.filter(p => p.category_id === category.id).length;
      return {
        id: category.id,
        image: getCategoryImage(category.name),
        title: `${category.name} Collection`,
        subtitle: `Discover ${productCount} amazing products`,
        buttonText: `Shop ${category.name}`,
        categoryName: category.name,
        categoryId: category.id
      };
    });
  }, [categories, allProducts]);

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, allProducts, sortBy, priceRange]);

  // Carousel auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🏠 Fetching home page data...');

      // Fetch all data in parallel
      const [categoriesRes, productsRes] = await Promise.all([
        customerAPI.getCategories(),
        customerAPI.getProducts({ limit: 100 }) // Fetch more products for filtering
      ]);

      console.log('📂 Categories response:', categoriesRes);
      console.log('📦 Products response:', productsRes);

      // Set categories
      const categoryList = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes?.data || categoriesRes?.categories || [];
      setCategories(categoryList);

      // Set products - ensure only approved products are shown
      const productList = Array.isArray(productsRes) ? productsRes : productsRes?.data || productsRes?.products || [];
      
      // Filter to only approved products (extra safety check)
      const approvedProducts = productList.filter(product => 
        product.approval_status === 'approved' && product.status === 'active'
      );
      
      setAllProducts(approvedProducts);

      // Create product sections for Amazon-style layout
      const shuffledProducts = [...approvedProducts].sort(() => 0.5 - Math.random());
      
      // Featured Products (first 8 products)
      setFeaturedProducts(shuffledProducts.slice(0, 8));
      
      // Today's Deals (products with discounts)
      const dealsProducts = approvedProducts.filter(product => 
        product.original_price && product.original_price > product.price
      ).slice(0, 12);
      setTodaysDeals(dealsProducts);
      
      // Best Sellers (products with high ratings)
      const bestSellerProducts = approvedProducts
        .filter(product => (product.average_rating || product.rating || 0) >= 4)
        .sort((a, b) => (b.average_rating || b.rating || 0) - (a.average_rating || a.rating || 0))
        .slice(0, 12);
      setBestSellers(bestSellerProducts);
      
      // New Arrivals (latest products)
      const newArrivalProducts = [...approvedProducts]
        .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0))
        .slice(0, 12);
      setNewArrivals(newArrivalProducts);

      // Recommended Products (random selection for personalization simulation)
      const recommendedSelection = [...approvedProducts]
        .sort(() => 0.5 - Math.random())
        .slice(0, 12);
      setRecommendedProducts(recommendedSelection);

      // Trending Products (products with good ratings and recent activity)
      const trendingSelection = approvedProducts
        .filter(product => (product.average_rating || product.rating || 0) >= 3.5)
        .sort(() => 0.5 - Math.random())
        .slice(0, 12);
      setTrendingProducts(trendingSelection);

      console.log('✅ Home data loaded successfully');
      console.log(`📊 Found ${categoryList.length} categories and ${approvedProducts.length} approved products`);
    } catch (err) {
      console.error('❌ Failed to load home data:', err);
      setError(err.message || 'Failed to load home page');
      toast.error('Failed to load home page data');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = selectedCategory === 'all' 
      ? allProducts 
      : allProducts.filter(product => product.category_id === selectedCategory);

    // Apply price range filter
    filtered = filtered.filter(product => {
      const price = Number(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.average_rating || b.rating || 0) - (a.average_rating || a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
        break;
      default:
        // featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryFilter = (categoryId) => {
    console.log('🔍 Filtering by category:', categoryId);
    setSelectedCategory(categoryId);
    // Smooth scroll to products section
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryClick = (categoryName) => {
    console.log('🔍 Filtering by category name:', categoryName);
    const category = categories.find(cat => cat.name === categoryName);
    if (category) {
      setSelectedCategory(category.id);
      // Smooth scroll to products section
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadMoreDeals = () => {
    setVisibleDeals(prev => Math.min(prev + 12, todaysDeals.length));
  };

  const loadMoreBestSellers = () => {
    setVisibleBestSellers(prev => Math.min(prev + 12, bestSellers.length));
  };

  const loadMoreNewArrivals = () => {
    setVisibleNewArrivals(prev => Math.min(prev + 12, newArrivals.length));
  };

  const loadMoreRecommended = () => {
    setVisibleRecommended(prev => Math.min(prev + 12, recommendedProducts.length));
  };

  const loadMoreTrending = () => {
    setVisibleTrending(prev => Math.min(prev + 12, trendingProducts.length));
  };

  const handleRetry = () => {
    fetchHomeData();
  };

  const handleProductClick = (productId) => {
    console.log('🔗 Navigating to product:', productId);
    navigate(`/product/${productId}`);
  };

  // Loading State
  if (loading) {
    return (
      <div style={{ backgroundColor: '#F7F8F8', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '20px' }}>
          <div style={{ height: '400px', background: '#E3E6E6', borderRadius: '8px', marginBottom: '20px' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <div style={{ height: '250px', background: '#E3E6E6', borderRadius: '4px', marginBottom: '15px' }}></div>
                <div style={{ height: '20px', background: '#E3E6E6', borderRadius: '4px', width: '60%' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div style={{ backgroundColor: '#F7F8F8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', textAlign: 'center', padding: '48px 32px', maxWidth: '28rem', margin: '0 16px' }}>
          <div style={{ fontSize: '3.75rem', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0F1111', marginBottom: '8px' }}>Oops! Something went wrong</h2>
          <p style={{ color: '#565959', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={handleRetry}
            style={{ backgroundColor: '#146EB4', color: '#fff', padding: '12px 32px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Amazon Ember, Arial, sans-serif', color: '#0F1111', lineHeight: '1.5', backgroundColor: '#F7F8F8', minHeight: '100vh' }}>
      
      {/* AMAZON-STYLE HERO CAROUSEL */}
      <section style={{ position: 'relative', height: '500px', overflow: 'hidden', marginBottom: '20px', backgroundColor: '#232F3E' }}>
        {carouselSlides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Overlay for better text visibility */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'
            }}></div>
            
            {/* Slide Content */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '1500px',
              width: '100%',
              padding: '0 40px',
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}>
              <div style={{ maxWidth: '600px' }}>
                <h1 style={{
                  fontSize: '3.5em',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '20px',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                  lineHeight: '1.2'
                }}>
                  {slide.title}
                </h1>
                <p style={{
                  fontSize: '1.5em',
                  color: '#fff',
                  marginBottom: '30px',
                  textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
                }}>
                  {slide.subtitle}
                </p>
                <button
                  onClick={() => handleCategoryClick(slide.categoryName)}
                  style={{
                    backgroundColor: '#FF9900',
                    color: '#131921',
                    padding: '16px 40px',
                    fontSize: '1.1em',
                    fontWeight: '700',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e88900';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#FF9900';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#131921',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            fontSize: '1.5em',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#fff';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ‹
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#131921',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            fontSize: '1.5em',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#fff';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ›
        </button>

        {/* Slide Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '12px',
          zIndex: 10
        }}>
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: currentSlide === index ? '40px' : '12px',
                height: '12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: currentSlide === index ? '#FF9900' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                if (currentSlide !== index) {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentSlide !== index) {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.6)';
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '1500px', margin: '0 auto', padding: '20px' }}>
        {/* CATEGORY SHOWCASE CARDS - PLACED AT TOP */}
        {categories.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontSize: '2em', 
              marginBottom: '20px', 
              fontWeight: '700',
              color: '#0F1111'
            }}>
              Shop by Category
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {categories.map((category) => {
                const categoryProductCount = allProducts.filter(p => p.category_id === category.id).length;
                return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer', overflow: 'hidden' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <h3 style={{ fontSize: '1.3em', marginBottom: '15px', color: '#0F1111' }}>
                    {getCategoryEmoji(category.name)} {category.name}
                  </h3>
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    borderRadius: '8px', 
                    marginBottom: '15px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src={getCategoryCardImage(category.name)}
                      alt={category.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.3s'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div style="
                            width: 100%; 
                            height: 100%; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-size: 4em;
                            border-radius: 8px;
                          ">
                            ${getCategoryEmoji(category.name)}
                          </div>
                        `;
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                  <p style={{ color: '#565959', fontSize: '0.9em', marginBottom: '10px' }}>
                    {categoryProductCount} products available
                  </p>
                  <span style={{ 
                    color: '#146EB4', 
                    fontSize: '0.9em', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    Shop now 
                    <span style={{ fontSize: '1.2em' }}>→</span>
                  </span>
                </div>
              );
            })}
          </div>
          </div>
        )}
        
        {/* AMAZON-STYLE PRODUCT SECTIONS */}
        {!loading && selectedCategory === 'all' && (
          <>
            {/* TODAY'S DEALS SECTION */}
            {todaysDeals.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.8em', margin: '0', fontWeight: '700', color: '#0F1111' }}>
                    Today's Deals
                  </h2>
                  <button
                    onClick={() => navigate('/deals')}
                    style={{ 
                      color: '#146EB4', 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '0.9em', 
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                  >
                    See all deals →
                  </button>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: '15px',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {todaysDeals.slice(0, visibleDeals).map((product) => {
                    const discount = calculateDiscount(product.price, product.original_price);
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        style={{ 
                          cursor: 'pointer', 
                          transition: 'transform 0.2s',
                          padding: '10px',
                          borderRadius: '4px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <div style={{ 
                          width: '100%', 
                          height: '150px', 
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
                          borderRadius: '4px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '3em', 
                          marginBottom: '10px',
                          position: 'relative'
                        }}>
                          {product.image_url && product.image_url.startsWith('http') ? (
                            <img
                              src={product.image_url}
                              alt={product.title || product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '📦';
                              }}
                            />
                          ) : '📦'}
                          {discount && (
                            <div style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              backgroundColor: '#CC0C39',
                              color: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7em',
                              fontWeight: 'bold'
                            }}>
                              -{discount}%
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: '0.85em', marginBottom: '5px', height: '32px', overflow: 'hidden' }}>
                          {(product.title || product.name).substring(0, 50)}...
                        </div>
                        <div style={{ fontSize: '1.2em', fontWeight: '700', color: '#B12704' }}>
                          ${Number(product.price).toFixed(2)}
                          {product.original_price && (
                            <span style={{ textDecoration: 'line-through', color: '#565959', fontSize: '0.7em', marginLeft: '8px' }}>
                              ${Number(product.original_price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {visibleDeals < todaysDeals.length && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      onClick={loadMoreDeals}
                      style={{
                        backgroundColor: '#fff',
                        color: '#0F1111',
                        padding: '12px 32px',
                        border: '1px solid #D5D9D9',
                        borderRadius: '8px',
                        fontSize: '0.95em',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#F7F8F8';
                        e.target.style.borderColor = '#FF9900';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.borderColor = '#D5D9D9';
                      }}
                    >
                      View More Deals ({todaysDeals.length - visibleDeals} remaining)
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* FEATURED PRODUCTS SECTION */}
            {featuredProducts.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.8em', margin: '0', fontWeight: '700', color: '#0F1111' }}>
                    Featured Products
                  </h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                  gap: '20px',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {featuredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        padding: '15px',
                        borderRadius: '4px',
                        border: '1px solid #E7E7E7'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4em', marginBottom: '15px' }}>
                        {product.image_url && product.image_url.startsWith('http') ? (
                          <img
                            src={product.image_url}
                            alt={product.title || product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '📦';
                            }}
                          />
                        ) : '📦'}
                      </div>
                      <div style={{ fontSize: '0.95em', marginBottom: '8px', height: '40px', overflow: 'hidden' }}>
                        {product.title || product.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '0.85em' }}>
                        <span style={{ color: '#FF9900' }}>
                          {renderStars(product.average_rating || product.rating)}
                        </span>
                        <span style={{ color: '#146EB4' }}>
                          ({product.total_reviews || product.reviews_count || 0})
                        </span>
                      </div>
                      <div style={{ fontSize: '1.4em', fontWeight: '700', color: '#B12704' }}>
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* BEST SELLERS SECTION */}
            {bestSellers.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.8em', margin: '0', fontWeight: '700', color: '#0F1111' }}>
                    Best Sellers
                  </h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: '15px',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {bestSellers.slice(0, visibleBestSellers).map((product, index) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'transform 0.2s',
                        padding: '10px',
                        borderRadius: '4px',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{ 
                        position: 'absolute',
                        top: '5px',
                        left: '5px',
                        backgroundColor: '#FF9900',
                        color: '#131921',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '0.7em',
                        fontWeight: 'bold',
                        zIndex: 1
                      }}>
                        #{index + 1}
                      </div>
                      <div style={{ width: '100%', height: '150px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3em', marginBottom: '10px' }}>
                        {product.image_url && product.image_url.startsWith('http') ? (
                          <img
                            src={product.image_url}
                            alt={product.title || product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '📦';
                            }}
                          />
                        ) : '📦'}
                      </div>
                      <div style={{ fontSize: '0.85em', marginBottom: '5px', height: '32px', overflow: 'hidden' }}>
                        {(product.title || product.name).substring(0, 50)}...
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '5px', fontSize: '0.8em' }}>
                        <span style={{ color: '#FF9900' }}>
                          {renderStars(product.average_rating || product.rating)}
                        </span>
                        <span style={{ color: '#146EB4', fontSize: '0.75em' }}>
                          ({product.total_reviews || product.reviews_count || 0})
                        </span>
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: '700', color: '#B12704' }}>
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                {visibleBestSellers < bestSellers.length && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      onClick={loadMoreBestSellers}
                      style={{
                        backgroundColor: '#fff',
                        color: '#0F1111',
                        padding: '12px 32px',
                        border: '1px solid #D5D9D9',
                        borderRadius: '8px',
                        fontSize: '0.95em',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#F7F8F8';
                        e.target.style.borderColor = '#FF9900';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.borderColor = '#D5D9D9';
                      }}
                    >
                      View More Best Sellers ({bestSellers.length - visibleBestSellers} remaining)
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* NEW ARRIVALS SECTION */}
            {newArrivals.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.8em', margin: '0', fontWeight: '700', color: '#0F1111' }}>
                    New Arrivals
                  </h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: '15px',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {newArrivals.slice(0, visibleNewArrivals).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'transform 0.2s',
                        padding: '10px',
                        borderRadius: '4px',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{ 
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: '#00A652',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '0.7em',
                        fontWeight: 'bold',
                        zIndex: 1
                      }}>
                        NEW
                      </div>
                      <div style={{ width: '100%', height: '150px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3em', marginBottom: '10px' }}>
                        {product.image_url && product.image_url.startsWith('http') ? (
                          <img
                            src={product.image_url}
                            alt={product.title || product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '📦';
                            }}
                          />
                        ) : '📦'}
                      </div>
                      <div style={{ fontSize: '0.85em', marginBottom: '5px', height: '32px', overflow: 'hidden' }}>
                        {(product.title || product.name).substring(0, 50)}...
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: '700', color: '#B12704' }}>
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                {visibleNewArrivals < newArrivals.length && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      onClick={loadMoreNewArrivals}
                      style={{
                        backgroundColor: '#fff',
                        color: '#0F1111',
                        padding: '12px 32px',
                        border: '1px solid #D5D9D9',
                        borderRadius: '8px',
                        fontSize: '0.95em',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#F7F8F8';
                        e.target.style.borderColor = '#FF9900';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.borderColor = '#D5D9D9';
                      }}
                    >
                      View More New Arrivals ({newArrivals.length - visibleNewArrivals} remaining)
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* RECOMMENDED FOR YOU SECTION */}
            {recommendedProducts.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.8em', margin: '0', fontWeight: '700', color: '#0F1111' }}>
                    Recommended for You
                  </h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: '15px',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {recommendedProducts.slice(0, visibleRecommended).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'transform 0.2s',
                        padding: '10px',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{ width: '100%', height: '150px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3em', marginBottom: '10px' }}>
                        {product.image_url && product.image_url.startsWith('http') ? (
                          <img
                            src={product.image_url}
                            alt={product.title || product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '📦';
                            }}
                          />
                        ) : '📦'}
                      </div>
                      <div style={{ fontSize: '0.85em', marginBottom: '5px', height: '32px', overflow: 'hidden' }}>
                        {(product.title || product.name).substring(0, 50)}...
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '5px', fontSize: '0.8em' }}>
                        <span style={{ color: '#FF9900' }}>
                          {renderStars(product.average_rating || product.rating)}
                        </span>
                        <span style={{ color: '#146EB4', fontSize: '0.75em' }}>
                          ({product.total_reviews || product.reviews_count || 0})
                        </span>
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: '700', color: '#B12704' }}>
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                {visibleRecommended < recommendedProducts.length && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      onClick={loadMoreRecommended}
                      style={{
                        backgroundColor: '#fff',
                        color: '#0F1111',
                        padding: '12px 32px',
                        border: '1px solid #D5D9D9',
                        borderRadius: '8px',
                        fontSize: '0.95em',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#F7F8F8';
                        e.target.style.borderColor = '#FF9900';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.borderColor = '#D5D9D9';
                      }}
                    >
                      View More Recommendations ({recommendedProducts.length - visibleRecommended} remaining)
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* TRENDING NOW SECTION */}
            {trendingProducts.length > 0 && (
              <section style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.8em', margin: '0', fontWeight: '700', color: '#0F1111' }}>
                    🔥 Trending Now
                  </h2>
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                  gap: '15px',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {trendingProducts.slice(0, visibleTrending).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={{ 
                        cursor: 'pointer', 
                        transition: 'transform 0.2s',
                        padding: '10px',
                        borderRadius: '4px',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div style={{ 
                        position: 'absolute',
                        top: '5px',
                        left: '5px',
                        backgroundColor: '#FF4500',
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '0.7em',
                        fontWeight: 'bold',
                        zIndex: 1
                      }}>
                        🔥 HOT
                      </div>
                      <div style={{ width: '100%', height: '150px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3em', marginBottom: '10px' }}>
                        {product.image_url && product.image_url.startsWith('http') ? (
                          <img
                            src={product.image_url}
                            alt={product.title || product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '📦';
                            }}
                          />
                        ) : '📦'}
                      </div>
                      <div style={{ fontSize: '0.85em', marginBottom: '5px', height: '32px', overflow: 'hidden' }}>
                        {(product.title || product.name).substring(0, 50)}...
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '5px', fontSize: '0.8em' }}>
                        <span style={{ color: '#FF9900' }}>
                          {renderStars(product.average_rating || product.rating)}
                        </span>
                        <span style={{ color: '#146EB4', fontSize: '0.75em' }}>
                          ({product.total_reviews || product.reviews_count || 0})
                        </span>
                      </div>
                      <div style={{ fontSize: '1.2em', fontWeight: '700', color: '#B12704' }}>
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                {visibleTrending < trendingProducts.length && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      onClick={loadMoreTrending}
                      style={{
                        backgroundColor: '#fff',
                        color: '#0F1111',
                        padding: '12px 32px',
                        border: '1px solid #D5D9D9',
                        borderRadius: '8px',
                        fontSize: '0.95em',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#F7F8F8';
                        e.target.style.borderColor = '#FF9900';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.borderColor = '#D5D9D9';
                      }}
                    >
                      View More Trending ({trendingProducts.length - visibleTrending} remaining)
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
        
        {/* FILTERED PRODUCTS */}
        {filteredProducts.length > 0 && (
          <div id="products-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h2 style={{ fontSize: '1.8em', margin: '0 0 5px 0', fontWeight: '700' }}>
                  {selectedCategory === 'all' ? 'All Products' : 
                   `${categories.find(c => c.id === selectedCategory)?.name || 'Category'} Products`}
                </h2>
                <span style={{ color: '#565959', fontSize: '0.9em' }}>
                  {filteredProducts.length} results
                </span>
              </div>
              
              {/* SORTING AND FILTERING CONTROLS */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #D5D9D9',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    color: '#0F1111',
                    fontSize: '0.9em',
                    cursor: 'pointer'
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '8px 12px', border: '1px solid #D5D9D9', borderRadius: '8px', backgroundColor: '#fff' }}>
                  <span style={{ fontSize: '0.85em', color: '#565959' }}>Price:</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                    style={{ width: '60px', padding: '4px', border: '1px solid #D5D9D9', borderRadius: '4px', fontSize: '0.85em' }}
                  />
                  <span style={{ color: '#565959' }}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 10000 }))}
                    style={{ width: '60px', padding: '4px', border: '1px solid #D5D9D9', borderRadius: '4px', fontSize: '0.85em' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {filteredProducts.map((product) => {
                const discount = calculateDiscount(product.price, product.original_price);
                return (
                  <a
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={(e) => { e.preventDefault(); handleProductClick(product.id); }}
                    style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer', textDecoration: 'none', color: '#0F1111', display: 'block' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4em', marginBottom: '10px' }}>
                      {product.image_url && product.image_url.startsWith('http') ? (
                        <img
                          src={product.image_url}
                          alt={product.title || product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '📦';
                          }}
                        />
                      ) : '📦'}
                    </div>
                    <div style={{ fontSize: '0.95em', marginBottom: '8px', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {product.title || product.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '0.85em' }}>
                      <span style={{ color: '#FF9900' }}>
                        {renderStars(product.average_rating || product.rating)}
                      </span>
                      <span style={{ color: '#146EB4' }}>
                        ({product.total_reviews || product.reviews_count || 0})
                      </span>
                    </div>
                    <div style={{ fontSize: '1.5em', fontWeight: '700', marginBottom: '5px' }}>
                      ${Number(product.price).toFixed(2)}
                      {product.original_price && (
                        <span style={{ textDecoration: 'line-through', color: '#565959', fontSize: '0.6em', marginLeft: '10px' }}>
                          ${Number(product.original_price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {discount && (
                      <span style={{ display: 'inline-block', backgroundColor: '#CC0C39', color: '#fff', padding: '3px 8px', borderRadius: '3px', fontSize: '0.75em', marginTop: '5px' }}>
                        {discount}% OFF
                      </span>
                    )}
                    {/* Approval Status Badge for debugging */}
                    {process.env.NODE_ENV === 'development' && (
                      <div style={{ fontSize: '0.7em', color: '#565959', marginTop: '5px' }}>
                        Status: {product.approval_status} | {product.status}
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* NO PRODUCTS MESSAGE */}
        {!loading && filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '4em', marginBottom: '20px' }}>📦</div>
            <h3 style={{ fontSize: '1.5em', marginBottom: '10px', color: '#0F1111' }}>
              {selectedCategory === 'all' ? 'No products available' : 'No products in this category'}
            </h3>
            <p style={{ color: '#565959', marginBottom: '20px' }}>
              {selectedCategory === 'all' 
                ? 'Check back later for new products.' 
                : 'Try browsing other categories or view all products.'}
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => handleCategoryFilter('all')}
                style={{ backgroundColor: '#146EB4', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
              >
                View All Products
              </button>
            )}
          </div>
        )}
      </main>

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#FF9900',
            color: '#131921',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            fontSize: '1.5em',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e88900';
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FF9900';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
          }}
          title="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default HomePage;