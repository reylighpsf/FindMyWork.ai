import React from "react";

// Komponen Card (sebagai named export)
export class Card extends React.Component {
  render() {
    const { className = "", children, ...props } = this.props;
    return (
      <div className={`bg-white rounded-lg border shadow-sm ${className}`} {...props}>
        {children}
      </div>
    );
  }
}

// Komponen CardContent
export class CardContent extends React.Component {
  render() {
    const { className = "", children, ...props } = this.props;
    return (
      <div className={`p-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
}

// Optional: default export (jika ingin import Card sebagai default)
export default Card;
