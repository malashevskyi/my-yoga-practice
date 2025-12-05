import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export type ParticleVariant = "default" | "snow" | "star";

interface BackgroundParticlesProps {
  variant?: ParticleVariant;
}

export function BackgroundParticles({
  variant = "default",
}: BackgroundParticlesProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const baseColor = "#ffffff";
  const snowColor = "#ffffff";
  const starColor = "#FFFACD";

  const options: ISourceOptions = useMemo(() => {
    const baseConfig: ISourceOptions = {
      background: {
        color: { value: "transparent" },
      },
      fpsLimit: 60,
      detectRetina: true,
      fullScreen: {
        enable: true,
        zIndex: -1,
      },
    };

    switch (variant) {
      case "snow":
        return {
          ...baseConfig,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "repulse" },
              onHover: { enable: true, mode: "bubble" },
            },
            modes: {
              repulse: { distance: 200, duration: 0.4 },
              bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8 },
            },
          },
          particles: {
            color: { value: snowColor },
            links: { enable: false },
            move: {
              direction: "bottom", // Snow falls down
              enable: true,
              outModes: { default: "out" },
              random: false,
              speed: 0.8,
              straight: false, // Natural wobble
            },
            number: {
              density: { enable: true, area: 800 },
              value: 100,
            },
            opacity: {
              value: { min: 0.1, max: 0.8 },
            },
            // shape: { type: "circle" },
            shape: {
              type: "image",
              options: {
                image: {
                  src: "/snowflake.svg",
                  width: 800, // Original width of the image
                  height: 800, // Original height of the image
                  replaceColor: true,
                },
              },
            },
            size: { value: { min: 3, max: 10 } },
          },
        };

      case "star":
        return {
          ...baseConfig,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "bubble" },
            },
            modes: {
              push: { quantity: 4 },
              bubble: { distance: 200, size: 6, duration: 2, opacity: 1 },
            },
          },
          particles: {
            color: { value: starColor },
            links: { enable: false },
            move: {
              enable: true,
              speed: 0.1, // Stars move very slowly (drifting)
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
            },
            number: {
              density: { enable: true, area: 800 },
              value: 60,
            },
            opacity: {
              value: { min: 0.1, max: 1 },
              animation: {
                enable: true,
                speed: 1, // Twinkling effect
                sync: false,
                mode: "auto",
              },
            },
            shape: {
              type: "star",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
        };

      case "default":
      default:
        return {
          ...baseConfig,
          interactivity: {
            events: {
              onClick: { enable: true, mode: "push" },
              onHover: { enable: true, mode: "bubble" },
            },
            modes: {
              push: { quantity: 4 },
              bubble: {
                distance: 200,
                size: 6,
                duration: 2,
                opacity: 0.8,
              },
            },
          },
          particles: {
            color: { value: baseColor },
            links: { enable: false },
            move: {
              direction: "top", // Move slowly upwards
              enable: true,
              outModes: { default: "out" },
              random: true,
              speed: 0.5,
              straight: false,
            },
            number: {
              density: { enable: true, area: 800 },
              value: 40,
            },
            opacity: {
              value: { min: 0.1, max: 0.5 },
              animation: {
                enable: true,
                speed: 0.5, // Slow pulsing
                sync: false,
                mode: "auto",
              },
            },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
        };
    }
  }, [variant, baseColor, snowColor, starColor]);

  if (!init) {
    return null;
  }

  return <Particles id="tsparticles" options={options} />;
}
