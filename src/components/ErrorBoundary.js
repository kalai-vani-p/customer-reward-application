import React from "react";
import { logger } from "../utils/logger";
import ErrorDisplay from "../components/ErrorDisplay";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError = () => ({ hasError: true });
    componentDidCatch = (e, info) => logger.error("Error caught:", e, info);
    render() {
        return this.state.hasError
            ? <ErrorDisplay message="Something went wrong" />
            : this.props.children;
    }
}
ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};
export default ErrorBoundary;