import { Tip, truncatePrincipal, microStxToStx, formatStx } from "@/lib/contract";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Identicon } from "@/components/Identicon";
import { ArrowRight, MessageSquare, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";