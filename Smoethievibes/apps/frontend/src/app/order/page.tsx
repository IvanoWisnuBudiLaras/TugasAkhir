"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Product = {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    category: string;
};

type CartItem = {
    product: Product;
    quantity: number;
};

export default function OrderPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('TAKEAWAY');
    const [tableNumber, setTableNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/Auth');
            return;
        }

        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/products`);
                if (!res.ok) throw new Error('Failed to fetch products');
                const data: Product[] = await res.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [router]);

    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
            setCart(cart.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
            ));
        }
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    };

    const handleSubmitOrder = async () => {
        if (cart.length === 0) {
            alert('Please add items to cart');
            return;
        }

        if (orderType === 'DINE_IN' && !tableNumber) {
            alert('Please enter table number for dine-in orders');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const orderData = {
                orderType,
                orderItems: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                notes,
                ...(orderType === 'DINE_IN' && tableNumber ? { tableNumber: parseInt(tableNumber) } : {}),
            };

            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!res.ok) throw new Error('Failed to create order');

            alert('Order placed successfully!');
            router.push('/Profile');
        } catch (err) {
            console.error(err);
            setError('Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold text-gray-800">Place Your Order</h1>
                    <p className="text-gray-600 mt-2">Select your favorite smoothies</p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Products */}
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-2xl shadow p-6"
                            >
                                {product.imageUrl && (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h3 className="font-bold text-lg">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-600 font-bold text-xl">
                                        Rp {product.price.toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Cart & Checkout */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ShoppingCart />
                                <h2 className="text-xl font-bold">Your Order</h2>
                            </div>

                            {/* Cart Items */}
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {cart.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">Cart is empty</p>
                                ) : (
                                    cart.map((item) => (
                                        <div key={item.product.id} className="flex justify-between items-center border-b pb-3">
                                            <div className="flex-1">
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    Rp {item.product.price.toLocaleString()} x {item.quantity}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="p-1 hover:bg-red-100 rounded text-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Order Type */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Order Type</label>
                                <div className="space-y-2">
                                    {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const).map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="orderType"
                                                value={type}
                                                checked={orderType === type}
                                                onChange={(e) => setOrderType(e.target.value as 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY')}
                                                className="text-green-600 focus:ring-green-500"
                                            />
                                            <span>{type.replace('_', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Table Number (Dine-in only) */}
                            {orderType === 'DINE_IN' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Table Number</label>
                                    <input
                                        type="number"
                                        value={tableNumber}
                                        onChange={(e) => setTableNumber(e.target.value)}
                                        placeholder="Enter table number"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            )}

                            {/* Notes */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Special requests..."
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Total */}
                            <div className="border-t pt-4 mb-4">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-green-600">Rp {calculateTotal().toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Submit */}
                            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={submitting || cart.length === 0}
                                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-400"
                            >
                                {submitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
