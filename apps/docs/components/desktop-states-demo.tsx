"use client";

import {
  DesktopAuthReturnState,
  DesktopErrorState,
  DesktopOfflineState,
  DesktopSignInState,
} from "../../../registry/desktop-states/desktop-states";

export function DesktopStatesDemo() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-lg border">
        <DesktopSignInState onSignIn={() => {}} />
      </div>
      <div className="rounded-lg border">
        <DesktopAuthReturnState onOpen={() => {}} />
      </div>
      <div className="rounded-lg border">
        <DesktopOfflineState onRetry={() => {}} />
      </div>
      <div className="rounded-lg border">
        <DesktopErrorState onRetry={() => {}} />
      </div>
    </div>
  );
}
