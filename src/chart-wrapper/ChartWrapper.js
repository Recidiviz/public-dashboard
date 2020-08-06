import styled from "styled-components";

const ChartWrapper = styled.div`
  /* classes provided by Semiotic */
  .frame {
    .axis-baseline {
      stroke: ${(props) => props.theme.colors.chartAxis};
    }

    .axis-label,
    .ordinal-labels {
      fill: ${(props) => props.theme.colors.chartAxis};
      font-size: 12px;
    }

    .background-graphics,
    .visualization-layer {
      shape-rendering: crispEdges;
    }

    .frame-title {
      fill: ${(props) => props.theme.colors.heading};
      font-size: 16px;
    }
  }
`;

export default ChartWrapper;
