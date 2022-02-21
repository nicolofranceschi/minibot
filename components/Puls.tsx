import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const redPulse = keyframes`
 0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);
	}
	
	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
	}
	
	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
	}
}`;


const greenPulse = keyframes`
 0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(51, 217, 178, 0.7);
	}
	
	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(51, 217, 178, 0);
	}
	
	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(51, 217, 178, 0);
	}
}`;

export const RedPulse = styled("div")({
    height: "15px",
    width: "15px",
    borderRadius: '50%',
    background: "rgba(255, 82, 82, 1)",
    transform: "scale(1)",
    boxShadow: `0 0 0 0 rgba(255, 82, 82, 1)`,
    animation: `${redPulse} 2s infinite`
});

export const GreenPulse = styled("div")({
    height: "15px",
    width: "15px",
    borderRadius: '50%',
    background: "rgba(51, 217, 178, 1)",
    transform: "scale(1)",
	boxShadow: "0 0 0 0 rgba(51, 217, 178, 1)",
    animation: `${greenPulse} 2s infinite`
});