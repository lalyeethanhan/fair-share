@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

@layer base {
  :root {
    --background: 160 20% 97%;
    --foreground: 180 10% 10%;
    --card: 0 0% 100%;
    --card-foreground: 180 10% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 180 10% 10%;
    --primary: 175 70% 32%;
    --primary-foreground: 0 0% 100%;
    --secondary: 160 15% 93%;
    --secondary-foreground: 180 10% 15%;
    --muted: 160 10% 94%;
    --muted-foreground: 180 5% 45%;
    --accent: 38 92% 50%;
    --accent-foreground: 180 10% 10%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 160 10% 88%;
    --input: 160 10% 88%;
    --ring: 175 70% 32%;
    --chart-1: 175 70% 32%;
    --chart-2: 38 92% 50%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.625rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 180 10% 15%;
    --sidebar-primary: 175 70% 32%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 160 15% 93%;
    --sidebar-accent-foreground: 180 10% 15%;
    --sidebar-border: 160 10% 88%;
    --sidebar-ring: 175 70% 32%;
    --success: 160 60% 40%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 180 10% 10%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
