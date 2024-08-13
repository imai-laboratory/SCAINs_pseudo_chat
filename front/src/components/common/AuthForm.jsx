import React from 'react';
import "../../assets/styles/AuthForm.css"

function AuthForm({ btnText, title, fields, onSubmit, error, onChange }) {
    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                {error && <div className="error">{error}</div>}
                <p className="fsize">{title}</p>
                {fields.map((field, index) => (
                    <input
                        key={index}
                        type={field.type}
                        value={field.value}
                        placeholder={field.placeholder}
                        onChange={(e) => onChange(index, e.target.value)}
                    />
                ))}
                <button type="submit">{btnText}</button>
            </form>
        </div>
    );
}

export default AuthForm;
