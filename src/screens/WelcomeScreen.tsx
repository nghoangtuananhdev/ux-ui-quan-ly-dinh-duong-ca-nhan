import React from "react";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { Logo } from "../components/layout/Header";

export interface WelcomeScreenProps {
  onStart: () => void;
  onExplore: () => void;
}

export default function WelcomeScreen({
  onStart,
  onExplore,
}: WelcomeScreenProps) {
  return (
    <div className="welcome">
      <div className="welcome-art">
        <div className="sun" />
        <div className="plate">
          <span className="leaf-one" />
          <span className="leaf-two" />
          <span className="grain" />
        </div>
        <div className="spark s1" />
        <div className="spark s2" />
      </div>

      <div className="welcome-copy">
        <Logo />
        <h1>
          Hiểu bữa ăn,
          <br />
          duy trì thói quen tốt.
        </h1>
        <p>
          Theo dõi dinh dưỡng theo cách nhẹ nhàng, đơn giản và phù hợp với nhịp
          sống của bạn.
        </p>
      </div>

      <div className="welcome-actions">
        <Button onClick={onStart}>Bắt đầu</Button>
        <Button variant="secondary" onClick={onExplore}>
          Khám phá bản mẫu
        </Button>
      </div>
    </div>
  );
}
