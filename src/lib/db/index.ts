// This file is intentionally empty.
// The parallel @vercel/postgres layer has been removed.
// Use the canonical Supabase layer:
//   - DB client:    @/lib/supabase/server  |  @/lib/supabase/client
//   - Lead CRUD:    @/lib/leads/helpers     (createLead, updateLead, findLeadByContact)
//   - Brief intake: @/lib/leads/briefs      (storeLeadBrief)
//   - Auth guard:   @/lib/auth/staff        (requireStaff)
