"use client";

import { Component, type ReactNode } from "react";
import { MachineFallback } from "@/components/lab/machine/MachineFallback";

type MachineErrorBoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

type MachineErrorBoundaryState = {
  failed: boolean;
};

export class MachineErrorBoundary extends Component<
  MachineErrorBoundaryProps,
  MachineErrorBoundaryState
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) {
      return <MachineFallback reason="model" />;
    }

    return this.props.children;
  }
}
