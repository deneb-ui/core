import React from 'react';
import { EditableText } from './EditableText';
import { EditableImage } from './EditableImage';

export interface CartItem {
  id?: string | number;
  product: {
    name: string;
    brand: string;
    image: string;
    price: number;
  };
  quantity: number;
  selectedStorage?: string;
  selectedColor?: string;
}

export interface EditableCartDrawerProps extends React.HTMLAttributes<HTMLElement> {
  itemPath: string;
  cart: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  cartSubtotal: number;
  imageFallback?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
}

export function EditableCartDrawer({
  itemPath,
  cart,
  isCartOpen,
  cartCount,
  cartSubtotal,
  imageFallback = '/placeholder.svg',
  as: Component = 'aside',
  className = '',
  style,
  ...props
}: EditableCartDrawerProps) {
  return (
    <Component
      data-preview-item-path={itemPath}
      className={`editable-cart-drawer ${className}`.trim()}
      style={style}
      {...(props as any)}
    >
      {isCartOpen && (
        <div className="cart-drawer">
          <div className="drawer-header">
            <EditableText
              as="h2"
              id={`${itemPath}.heading`}
              data-preview-field-path={`${itemPath}.heading`}
              defaultValue="Your Shopping Bag"
              className="drawer-title"
            />
            <span className="cart-count">{cartCount}</span>
          </div>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <EditableText
                as="h3"
                id={`${itemPath}.emptyCartMessage`}
                data-preview-field-path={`${itemPath}.emptyCartMessage`}
                defaultValue="Your Bag is Currently Empty"
                className="empty-cart-title"
              />
              <EditableText
                as="p"
                id={`${itemPath}.emptyCartDescription`}
                data-preview-field-path={`${itemPath}.emptyCartDescription`}
                defaultValue="Explore our flagship phones, refurbished devices, and engineered accessories to add items to your order."
                className="empty-cart-description"
              />
            </div>
          ) : (
            <div className="cart-items" data-preview-list-path={`${itemPath}.cartItems`}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                  data-preview-item-path={`${itemPath}.cartItems.${item.id}`}
                >
                  <EditableImage
                    id={`${itemPath}.cartItems.${item.id}.image`}
                    data-preview-field-path={`${itemPath}.cartItems.${item.id}.image`}
                    src={item.product.image}
                    fallbackSrc={imageFallback}
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <EditableText
                      as="span"
                      id={`${itemPath}.cartItems.${item.id}.brand`}
                      data-preview-field-path={`${itemPath}.cartItems.${item.id}.brand`}
                      defaultValue={item.product.brand}
                      className="cart-item-brand"
                    />
                    <EditableText
                      as="h4"
                      id={`${itemPath}.cartItems.${item.id}.name`}
                      data-preview-field-path={`${itemPath}.cartItems.${item.id}.name`}
                      defaultValue={item.product.name}
                      className="cart-item-name"
                    />
                    <span className="cart-item-quantity">Quantity: {item.quantity}</span>
                    <span className="cart-item-price">RS {item.product.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="cart-summary">
            <EditableText
              as="span"
              id={`${itemPath}.subtotalLabel`}
              data-preview-field-path={`${itemPath}.subtotalLabel`}
              defaultValue="Subtotal"
              className="cart-subtotal-label"
            />
            <span className="cart-subtotal-value">RS {cartSubtotal}</span>
          </div>
        </div>
      )}
    </Component>
  );
}