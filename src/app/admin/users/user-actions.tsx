"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toggleAdminRole, deleteUser, resetUserStreak, forceCompleteToday } from "@/app/actions/admin"
import { MoreHorizontal, Shield, ShieldAlert, Trash2, CheckCircle, RotateCcw } from "lucide-react"

export function UserActions({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false)

  const handleAction = async (actionFn: () => Promise<any>, confirmMsg?: string) => {
    if (confirmMsg && !confirm(confirmMsg)) return
    
    setLoading(true)
    try {
      await actionFn()
    } catch (error: any) {
      console.error(error)
      alert(error.message || "Action failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted" disabled={loading}>
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem 
            onClick={() => handleAction(() => toggleAdminRole(userId, currentRole))}
            className={currentRole === "ADMIN" ? "text-orange-500" : ""}
          >
            {currentRole === "ADMIN" ? <ShieldAlert className="mr-2 h-4 w-4" /> : <Shield className="mr-2 h-4 w-4" />}
            {currentRole === "ADMIN" ? "Revoke Admin" : "Make Admin"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleAction(() => forceCompleteToday(userId))}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Force Complete Today
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleAction(() => resetUserStreak(userId), "Are you sure you want to reset this user's streak to 0?")}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Streak
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={() => handleAction(() => deleteUser(userId), "Are you sure you want to permanently delete this user?")}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
