import styled from "styled-components";

interface Roulette {
  startspinningtime: number;
  continuespinningtime: number;
  stopspinningtime: number;
  startrotationdegrees: number;
  finalrotationdegrees: number;
}

export const RotationContainer = styled.div<Roulette>`
  transform: rotate(${(props) => props.startrotationdegrees}deg);
  &.started-spinning {
    animation: spin ${({ startspinningtime }) => startspinningtime / 1000}s
        cubic-bezier(0.71, -0.29, 0.96, 0.9) 0s 1 normal forwards running,
      continueSpin 0.75s linear
        ${({ startspinningtime }) => startspinningtime / 1000}s 1 normal
        forwards running,
      stopSpin ${({ stopspinningtime }) => stopspinningtime / 1000}s
        cubic-bezier(0, 0, 0.35, 1.02)
        ${({ startspinningtime, continuespinningtime }) =>
          (startspinningtime + continuespinningtime) / 1000}s
        1 normal forwards running;
  }
  @keyframes spin {
    from {
      transform: rotate(${(props) => props.startrotationdegrees}deg);
    }
    to {
      transform: rotate(${(props) => props.startrotationdegrees + 360}deg);
    }
  }
  @keyframes continueSpin {
    from {
      transform: rotate(${(props) => props.startrotationdegrees}deg);
    }
    to {
      transform: rotate(${(props) => props.startrotationdegrees + 360}deg);
    }
  }
  @keyframes stopSpin {
    from {
      transform: rotate(${(props) => props.startrotationdegrees}deg);
    }
    to {
      transform: rotate(${(props) => 1440 + props.finalrotationdegrees}deg);
    }
  }
`;
