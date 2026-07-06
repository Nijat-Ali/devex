import { createClient } from "@supabase/supabase-js";

const url = "https://nrqrdcgynmzymydhgwug.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycXJkY2d5bm16eW15ZGhnd3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODA4NDcsImV4cCI6MjA5ODU1Njg0N30.AMIwju0eKCOKouNWR4-3UcltITr8chKSRpLLrjo61ss";

export const supabase = createClient(url, key);
