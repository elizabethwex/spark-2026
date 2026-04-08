"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronRight, Check, Minus, Search } from "lucide-react"
import { cn } from "../lib/utils"
import { WexInput } from "../form-inputs/wex-input"

/**
 * WexTree - WEX Design System Tree Component
 *
 * A hierarchical tree view component with selection and filtering support.
 * Built following the PrimeReact v11 compound component structure.
 *
 * Compound Components:
 * - WexTree (Root)
 * - WexTree.Header - Header section for filter/actions
 * - WexTree.Filter - Search input for filtering nodes
 * - WexTree.List - Container for tree nodes
 * - WexTree.Node - Individual tree node
 * - WexTree.Content - Node content wrapper
 * - WexTree.Toggle - Expand/collapse toggle
 * - WexTree.Footer - Footer section
 * - WexTree.Empty - Empty state message
 *
 * @example
 * <WexTree nodes={nodes} selectionMode="single" value={selected} onValueChange={setSelected}>
 *   <WexTree.Header>
 *     <WexTree.Filter placeholder="Search..." />
 *   </WexTree.Header>
 *   <WexTree.List />
 *   <WexTree.Empty>No items found</WexTree.Empty>
 * </WexTree>
 */

// ============================================================================
// Types
// ============================================================================

export interface TreeNode {
  /** Unique key for the node */
  key: string
  /** Display label */
  label: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Child nodes */
  children?: TreeNode[]
  /** Whether node is disabled */
  disabled?: boolean
  /** Optional custom data */
  data?: unknown
}

export interface WexTreeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Array of tree nodes */
  nodes: TreeNode[]
  /** Currently selected key(s) */
  value?: string | string[] | null
  /** Callback when selection changes */
  onValueChange?: (value: string | string[] | null) => void
  /** Selection mode: single, multiple, or checkbox */
  selectionMode?: "single" | "multiple" | "checkbox"
  /** Currently expanded node keys */
  expandedKeys?: string[]
  /** Callback when expanded keys change */
  onExpandedKeysChange?: (keys: string[]) => void
  /** Disable the entire tree */
  disabled?: boolean
  /** Accessible label */
  "aria-label"?: string
  /** ID of element that labels this tree */
  "aria-labelledby"?: string
  /** Children (compound components) */
  children?: React.ReactNode
}

// ============================================================================
// Context
// ============================================================================

interface TreeContextValue {
  // Data
  nodes: TreeNode[]
  // State
  selectionMode: "single" | "multiple" | "checkbox" | null
  selectedKeys: Set<string>
  expandedKeys: Set<string>
  focusedKey: string | null
  isKeyboardFocus: boolean
  filterValue: string
  setFilterValue: (value: string) => void
  disabled: boolean
  // Actions
  toggleSelection: (key: string, nodeDisabled?: boolean) => void
  toggleExpanded: (key: string) => void
  setFocusedKey: (key: string | null, isKeyboard?: boolean) => void
  clearFocus: () => void
  isSelected: (key: string) => boolean
  isExpanded: (key: string) => boolean
  isVisible: (node: TreeNode) => boolean
  getCheckboxState: (key: string) => "checked" | "unchecked" | "indeterminate"
  // Refs
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>
  // Navigation
  getVisibleNodes: () => TreeNode[]
  focusNode: (key: string) => void
  // ARIA
  ariaLabel?: string
  ariaLabelledBy?: string
}

const TreeContext = React.createContext<TreeContextValue | null>(null)

function useTreeContext() {
  const context = React.useContext(TreeContext)
  if (!context) {
    throw new Error("Tree components must be used within WexTree")
  }
  return context
}

// ============================================================================
// Variants
// ============================================================================

const treeVariants = cva(
  "wex-tree w-full rounded-md border bg-wex-tree-bg text-sm",
  {
    variants: {
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
)

const treeNodeVariants = cva(
  "wex-tree-node flex items-center gap-1 px-2 py-1.5 cursor-pointer select-none transition-colors rounded-sm outline-none",
  {
    variants: {
      selected: {
        true: "bg-wex-tree-node-selected-bg/15 text-wex-tree-node-fg",
        false: "",
      },
      focused: {
        true: "ring-2 ring-wex-tree-focus-ring ring-inset",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    compoundVariants: [
      {
        selected: false,
        disabled: false,
        className: "hover:bg-wex-tree-node-hover-bg/50",
      },
      {
        selected: true,
        disabled: false,
        className: "hover:bg-wex-tree-node-selected-bg/25",
      },
    ],
    defaultVariants: {
      selected: false,
      focused: false,
      disabled: false,
    },
  }
)

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Flatten tree to array of visible nodes (for keyboard navigation)
 */
function flattenVisibleNodes(
  nodes: TreeNode[],
  expandedKeys: Set<string>,
  filterFn?: (node: TreeNode) => boolean
): TreeNode[] {
  const result: TreeNode[] = []

  function traverse(nodeList: TreeNode[]) {
    for (const node of nodeList) {
      if (filterFn && !filterFn(node)) continue
      result.push(node)
      if (node.children && expandedKeys.has(node.key)) {
        traverse(node.children)
      }
    }
  }

  traverse(nodes)
  return result
}

/**
 * Check if a node or any of its children match the filter
 */
function nodeMatchesFilter(node: TreeNode, filter: string): boolean {
  const normalizedFilter = filter.toLowerCase()
  if (node.label.toLowerCase().includes(normalizedFilter)) {
    return true
  }
  if (node.children) {
    return node.children.some((child) => nodeMatchesFilter(child, filter))
  }
  return false
}

/**
 * Get all node keys in the tree
 */
function getAllKeys(nodes: TreeNode[]): string[] {
  const keys: string[] = []
  function traverse(nodeList: TreeNode[]) {
    for (const node of nodeList) {
      keys.push(node.key)
      if (node.children) {
        traverse(node.children)
      }
    }
  }
  traverse(nodes)
  return keys
}

/**
 * Find a node by key in the tree
 */
function findNode(nodes: TreeNode[], key: string): TreeNode | null {
  for (const node of nodes) {
    if (node.key === key) return node
    if (node.children) {
      const found = findNode(node.children, key)
      if (found) return found
    }
  }
  return null
}

/**
 * Find parent node of a given key
 */
function findParentNode(
  nodes: TreeNode[],
  key: string,
  parent: TreeNode | null = null
): TreeNode | null {
  for (const node of nodes) {
    if (node.key === key) return parent
    if (node.children) {
      const found = findParentNode(node.children, key, node)
      if (found !== null) return found
    }
  }
  return null
}

/**
 * Get all leaf nodes (nodes without children) under a node
 */
function getLeafDescendantKeys(node: TreeNode): string[] {
  const keys: string[] = []
  if (!node.children || node.children.length === 0) {
    // This node itself is a leaf
    if (!node.disabled) {
      keys.push(node.key)
    }
  } else {
    // Recurse into children
    for (const child of node.children) {
      keys.push(...getLeafDescendantKeys(child))
    }
  }
  return keys
}

// ============================================================================
// Root Component
// ============================================================================

const WexTreeRoot = React.forwardRef<HTMLDivElement, WexTreeProps>(
  (
    {
      className,
      nodes,
      value,
      onValueChange,
      selectionMode = null,
      expandedKeys: controlledExpandedKeys,
      onExpandedKeysChange,
      disabled = false,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      children,
      ...props
    },
    ref
  ) => {
    // Internal state
    const [internalExpandedKeys, setInternalExpandedKeys] = React.useState<
      Set<string>
    >(() => new Set(getAllKeys(nodes))) // Expand all by default
    const [focusedKey, setFocusedKeyState] = React.useState<string | null>(null)
    const [isKeyboardFocus, setIsKeyboardFocus] = React.useState(false)
    const [filterValue, setFilterValue] = React.useState("")

    const nodeRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Controlled vs uncontrolled expanded keys
    const isControlledExpanded = controlledExpandedKeys !== undefined
    const expandedKeys = isControlledExpanded
      ? new Set(controlledExpandedKeys)
      : internalExpandedKeys

    // Selection as Set
    const selectedKeys = React.useMemo(() => {
      if (value === null || value === undefined) return new Set<string>()
      if (Array.isArray(value)) return new Set(value)
      return new Set([value])
    }, [value])

    // Filter function
    const filterFn = React.useCallback(
      (node: TreeNode) => {
        if (!filterValue) return true
        return nodeMatchesFilter(node, filterValue)
      },
      [filterValue]
    )

    // Get visible nodes for navigation
    const getVisibleNodes = React.useCallback(() => {
      return flattenVisibleNodes(nodes, expandedKeys, filterFn)
    }, [nodes, expandedKeys, filterFn])

    // Get checkbox state for a node (checked, unchecked, or indeterminate)
    // Uses leaf nodes only - parent state is derived from leaf descendant selection
    const getCheckboxState = React.useCallback(
      (key: string): "checked" | "unchecked" | "indeterminate" => {
        const node = findNode(nodes, key)
        if (!node) return "unchecked"

        // If leaf node (no children), just check if selected
        if (!node.children || node.children.length === 0) {
          return selectedKeys.has(key) ? "checked" : "unchecked"
        }

        // For parent nodes, derive state from LEAF descendants only
        const leafDescendants = getLeafDescendantKeys(node)
        if (leafDescendants.length === 0) {
          return selectedKeys.has(key) ? "checked" : "unchecked"
        }

        // Count selected leaf descendants
        const selectedCount = leafDescendants.filter((k) =>
          selectedKeys.has(k)
        ).length

        if (selectedCount === 0) {
          return "unchecked"
        }
        if (selectedCount === leafDescendants.length) {
          return "checked"
        }
        return "indeterminate"
      },
      [nodes, selectedKeys]
    )

    // Set focused key with keyboard tracking
    const setFocusedKey = React.useCallback((key: string | null, isKeyboard: boolean = false) => {
      setFocusedKeyState(key)
      setIsKeyboardFocus(isKeyboard)
    }, [])

    // Clear focus (when tree loses focus)
    const clearFocus = React.useCallback(() => {
      setFocusedKeyState(null)
      setIsKeyboardFocus(false)
    }, [])

    // Toggle selection
    const toggleSelection = React.useCallback(
      (key: string, nodeDisabled?: boolean) => {
        if (disabled || nodeDisabled || !selectionMode) return

        const node = findNode(nodes, key)
        if (!node) return

        if (selectionMode === "single") {
          const newValue = selectedKeys.has(key) ? null : key
          onValueChange?.(newValue)
        } else if (selectionMode === "multiple") {
          const newKeys = new Set(selectedKeys)
          if (newKeys.has(key)) {
            newKeys.delete(key)
          } else {
            newKeys.add(key)
          }
          onValueChange?.(newKeys.size > 0 ? Array.from(newKeys) : null)
        } else if (selectionMode === "checkbox") {
          const newKeys = new Set(selectedKeys)
          const currentState = getCheckboxState(key)

          // Get leaf descendants for this node
          const leafDescendants = getLeafDescendantKeys(node)
          const isLeaf = !node.children || node.children.length === 0

          if (currentState === "checked" || currentState === "indeterminate") {
            // Deselect: remove this node (if leaf) and all leaf descendants
            if (isLeaf) {
              newKeys.delete(key)
            }
            leafDescendants.forEach((k) => newKeys.delete(k))
          } else {
            // Select: add this node (if leaf) and all leaf descendants
            if (isLeaf) {
              newKeys.add(key)
            }
            leafDescendants.forEach((k) => newKeys.add(k))
          }
          onValueChange?.(newKeys.size > 0 ? Array.from(newKeys) : null)
        }
      },
      [disabled, selectionMode, selectedKeys, nodes, onValueChange, getCheckboxState]
    )

    // Toggle expanded
    const toggleExpanded = React.useCallback(
      (key: string) => {
        const newExpanded = new Set(expandedKeys)
        if (newExpanded.has(key)) {
          newExpanded.delete(key)
        } else {
          newExpanded.add(key)
        }

        if (isControlledExpanded) {
          onExpandedKeysChange?.(Array.from(newExpanded))
        } else {
          setInternalExpandedKeys(newExpanded)
        }
      },
      [expandedKeys, isControlledExpanded, onExpandedKeysChange]
    )

    // Check if selected
    const isSelected = React.useCallback(
      (key: string) => selectedKeys.has(key),
      [selectedKeys]
    )

    // Check if expanded
    const isExpanded = React.useCallback(
      (key: string) => expandedKeys.has(key),
      [expandedKeys]
    )

    // Check if visible (passes filter)
    const isVisible = React.useCallback(
      (node: TreeNode) => filterFn(node),
      [filterFn]
    )

    // Focus a node (keyboard navigation)
    const focusNode = React.useCallback((key: string) => {
      setFocusedKeyState(key)
      setIsKeyboardFocus(true)
      const nodeEl = nodeRefs.current.get(key)
      if (nodeEl) {
        nodeEl.focus()
        nodeEl.scrollIntoView({ block: "nearest" })
      }
    }, [])

    // Context value
    const contextValue: TreeContextValue = {
      nodes,
      selectionMode,
      selectedKeys,
      expandedKeys,
      focusedKey,
      isKeyboardFocus,
      filterValue,
      setFilterValue,
      disabled,
      toggleSelection,
      toggleExpanded,
      setFocusedKey,
      clearFocus,
      isSelected,
      isExpanded,
      isVisible,
      getCheckboxState,
      nodeRefs,
      getVisibleNodes,
      focusNode,
      ariaLabel,
      ariaLabelledBy,
    }

    // Check if we have custom children or should render default
    const hasCustomChildren = React.Children.count(children) > 0

    return (
      <TreeContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(treeVariants({ disabled }), className)}
          {...props}
        >
          {hasCustomChildren ? children : (
            <>
              <TreeList ref={containerRef} />
              {getVisibleNodes().length === 0 && filterValue && (
                <TreeEmpty>No results found</TreeEmpty>
              )}
            </>
          )}
        </div>
      </TreeContext.Provider>
    )
  }
)
WexTreeRoot.displayName = "WexTree"

// ============================================================================
// Header Component
// ============================================================================

interface TreeHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const TreeHeader = React.forwardRef<HTMLDivElement, TreeHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-2 border-b", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TreeHeader.displayName = "WexTree.Header"

// ============================================================================
// Filter Component
// ============================================================================

interface TreeFilterProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  placeholder?: string
}

const TreeFilter = React.forwardRef<HTMLInputElement, TreeFilterProps>(
  ({ className, placeholder = "Search...", ...props }, ref) => {
    const { filterValue, setFilterValue } = useTreeContext()

    return (
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-wex-tree-search-icon-fg" />
        <WexInput
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={filterValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterValue(e.target.value)}
          className={cn("h-8 pl-8", className)}
          aria-label="Filter tree"
          {...props}
        />
      </div>
    )
  }
)
TreeFilter.displayName = "WexTree.Filter"

// ============================================================================
// List Component
// ============================================================================

interface TreeListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TreeList = React.forwardRef<HTMLDivElement, TreeListProps>(
  ({ className, ...props }, ref) => {
    const {
      nodes,
      selectionMode,
      disabled,
      getVisibleNodes,
      focusNode,
      toggleExpanded,
      toggleSelection,
      isExpanded,
      isVisible,
      focusedKey,
      clearFocus,
      ariaLabel,
      ariaLabelledBy,
    } = useTreeContext()

    // Handle blur on the container - clear focus when leaving the tree
    const handleBlur = React.useCallback(
      (e: React.FocusEvent) => {
        // Check if focus is moving outside this tree
        const container = e.currentTarget
        const relatedTarget = e.relatedTarget as Node | null
        
        if (!relatedTarget || !container.contains(relatedTarget)) {
          clearFocus()
        }
      },
      [clearFocus]
    )

    // Keyboard navigation
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return

        const visibleNodes = getVisibleNodes()
        if (visibleNodes.length === 0) return

        const currentIndex = focusedKey
          ? visibleNodes.findIndex((n) => n.key === focusedKey)
          : -1

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault()
            if (currentIndex < visibleNodes.length - 1) {
              focusNode(visibleNodes[currentIndex + 1].key)
            } else if (currentIndex === -1 && visibleNodes.length > 0) {
              focusNode(visibleNodes[0].key)
            }
            break
          }

          case "ArrowUp": {
            e.preventDefault()
            if (currentIndex > 0) {
              focusNode(visibleNodes[currentIndex - 1].key)
            } else if (currentIndex === -1 && visibleNodes.length > 0) {
              focusNode(visibleNodes[visibleNodes.length - 1].key)
            }
            break
          }

          case "ArrowRight": {
            e.preventDefault()
            if (focusedKey) {
              const node = findNode(nodes, focusedKey)
              if (node?.children && node.children.length > 0) {
                if (!isExpanded(focusedKey)) {
                  toggleExpanded(focusedKey)
                } else {
                  // Move to first child
                  const firstChild = node.children.find((c) => isVisible(c))
                  if (firstChild) {
                    focusNode(firstChild.key)
                  }
                }
              }
            }
            break
          }

          case "ArrowLeft": {
            e.preventDefault()
            if (focusedKey) {
              const node = findNode(nodes, focusedKey)
              if (node?.children && isExpanded(focusedKey)) {
                toggleExpanded(focusedKey)
              } else {
                // Move to parent
                const parent = findParentNode(nodes, focusedKey)
                if (parent) {
                  focusNode(parent.key)
                }
              }
            }
            break
          }

          case "Enter":
          case " ": {
            e.preventDefault()
            if (focusedKey) {
              const node = findNode(nodes, focusedKey)
              if (selectionMode) {
                toggleSelection(focusedKey, node?.disabled)
              } else if (node?.children) {
                toggleExpanded(focusedKey)
              }
            }
            break
          }

          case "Home": {
            e.preventDefault()
            if (visibleNodes.length > 0) {
              focusNode(visibleNodes[0].key)
            }
            break
          }

          case "End": {
            e.preventDefault()
            if (visibleNodes.length > 0) {
              focusNode(visibleNodes[visibleNodes.length - 1].key)
            }
            break
          }
        }
      },
      [
        disabled,
        focusedKey,
        nodes,
        getVisibleNodes,
        focusNode,
        isExpanded,
        isVisible,
        toggleExpanded,
        toggleSelection,
        selectionMode,
      ]
    )

    // Render nodes recursively
    const renderNodes = (nodeList: TreeNode[], depth: number = 0) => {
      return nodeList.map((node) => {
        if (!isVisible(node)) return null

        return (
          <TreeNodeInternal
            key={node.key}
            node={node}
            depth={depth}
          >
            {node.children &&
              node.children.length > 0 &&
              isExpanded(node.key) && (
                <div role="group">{renderNodes(node.children, depth + 1)}</div>
              )}
          </TreeNodeInternal>
        )
      })
    }

    return (
      <div
        ref={ref}
        role="tree"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-multiselectable={
          selectionMode === "multiple" || selectionMode === "checkbox"
            ? true
            : undefined
        }
        className={cn("p-1 outline-none", className)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        {...props}
      >
        {renderNodes(nodes)}
      </div>
    )
  }
)
TreeList.displayName = "WexTree.List"

// ============================================================================
// Internal Node Component (used by TreeList)
// ============================================================================

interface TreeNodeInternalProps {
  node: TreeNode
  depth: number
  children?: React.ReactNode
}

function TreeNodeInternal({
  node,
  depth,
  children,
}: TreeNodeInternalProps) {
  const {
    nodes,
    selectionMode,
    focusedKey,
    isKeyboardFocus,
    disabled: treeDisabled,
    toggleSelection,
    toggleExpanded,
    isSelected,
    isExpanded,
    isVisible,
    getCheckboxState,
    setFocusedKey,
    focusNode,
    getVisibleNodes,
    nodeRefs,
  } = useTreeContext()

  const hasChildren = node.children && node.children.length > 0
  const expanded = isExpanded(node.key)
  const selected = isSelected(node.key)
  const focused = focusedKey === node.key
  const nodeDisabled = node.disabled || treeDisabled
  const checkboxState = selectionMode === "checkbox" ? getCheckboxState(node.key) : null

  // Only show focus ring for keyboard navigation
  const showFocusRing = focused && isKeyboardFocus

  // Register ref
  const setRef = (el: HTMLDivElement | null) => {
    if (el) {
      nodeRefs.current.set(node.key, el)
    } else {
      nodeRefs.current.delete(node.key)
    }
  }

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    // Prevent focus on mouse click to avoid focus ring flash
    // Keyboard navigation will still work via tabIndex and keyboard events
    if (e.button === 0) { // Only prevent for left mouse button
      e.preventDefault()
    }
  }, [])

  const handleClick = React.useCallback(() => {
    if (nodeDisabled) return

    // Don't set focus on click - only keyboard navigation should focus
    // This prevents the focus ring flash when clicking

    if (selectionMode) {
      toggleSelection(node.key, nodeDisabled)
    } else if (hasChildren) {
      toggleExpanded(node.key)
    }
  }, [
    nodeDisabled,
    node.key,
    selectionMode,
    hasChildren,
    toggleSelection,
    toggleExpanded,
  ])

  const handleToggleMouseDown = React.useCallback((e: React.MouseEvent) => {
    // Prevent focus on toggle click
    if (e.button === 0) {
      e.preventDefault()
    }
  }, [])

  const handleToggleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!nodeDisabled && hasChildren) {
        // Don't set focus on toggle click
        toggleExpanded(node.key)
      }
    },
    [nodeDisabled, hasChildren, node.key, toggleExpanded]
  )

  const handleFocus = React.useCallback((e: React.FocusEvent) => {
    // Detect if focus came from keyboard (Tab) vs mouse click
    // If relatedTarget is outside the tree or null, it's likely Tab navigation
    const isKeyboardNavigation = !e.relatedTarget || 
      !(e.currentTarget.closest('.wex-tree')?.contains(e.relatedTarget as Node))
    
    setFocusedKey(node.key, isKeyboardNavigation)
  }, [node.key, setFocusedKey])

  // Keyboard navigation handler
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (nodeDisabled) return

      const visibleNodes = getVisibleNodes()
      const currentIndex = visibleNodes.findIndex((n) => n.key === node.key)

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault()
          if (currentIndex < visibleNodes.length - 1) {
            focusNode(visibleNodes[currentIndex + 1].key)
          }
          break
        }

        case "ArrowUp": {
          e.preventDefault()
          if (currentIndex > 0) {
            focusNode(visibleNodes[currentIndex - 1].key)
          }
          break
        }

        case "ArrowRight": {
          e.preventDefault()
          if (hasChildren) {
            if (!expanded) {
              toggleExpanded(node.key)
            } else {
              // Move to first visible child
              const firstChild = node.children?.find((c) => isVisible(c))
              if (firstChild) {
                focusNode(firstChild.key)
              }
            }
          }
          break
        }

        case "ArrowLeft": {
          e.preventDefault()
          if (hasChildren && expanded) {
            toggleExpanded(node.key)
          } else {
            // Move to parent
            const parent = findParentNode(nodes, node.key)
            if (parent) {
              focusNode(parent.key)
            }
          }
          break
        }

        case "Enter":
        case " ": {
          e.preventDefault()
          if (selectionMode) {
            toggleSelection(node.key, nodeDisabled)
          } else if (hasChildren) {
            toggleExpanded(node.key)
          }
          break
        }

        case "Home": {
          e.preventDefault()
          if (visibleNodes.length > 0) {
            focusNode(visibleNodes[0].key)
          }
          break
        }

        case "End": {
          e.preventDefault()
          if (visibleNodes.length > 0) {
            focusNode(visibleNodes[visibleNodes.length - 1].key)
          }
          break
        }
      }
    },
    [
      nodeDisabled,
      node,
      hasChildren,
      expanded,
      nodes,
      getVisibleNodes,
      focusNode,
      toggleExpanded,
      toggleSelection,
      selectionMode,
      isVisible,
    ]
  )

  return (
    <div
      role="treeitem"
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={selectionMode ? selected : undefined}
      aria-disabled={nodeDisabled || undefined}
    >
      <div
        ref={setRef}
        tabIndex={nodeDisabled ? -1 : 0}
        className={cn(
          treeNodeVariants({
            selected: selectionMode ? selected : false,
            focused: showFocusRing,
            disabled: nodeDisabled,
          })
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        {/* Toggle icon */}
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center shrink-0 transition-transform",
            hasChildren ? "cursor-pointer" : "invisible"
          )}
          onMouseDown={handleToggleMouseDown}
          onClick={handleToggleClick}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-90"
            )}
          />
        </span>

        {/* Checkbox (for checkbox mode) */}
        {selectionMode === "checkbox" && (
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-wex-tree-checkbox-checked-bg transition-colors",
              checkboxState === "checked" || checkboxState === "indeterminate"
                ? "bg-wex-tree-checkbox-checked-bg text-wex-tree-checkbox-checked-fg"
                : "bg-wex-tree-checkbox-bg"
            )}
          >
            {checkboxState === "checked" && <Check className="h-3 w-3" />}
            {checkboxState === "indeterminate" && <Minus className="h-3 w-3" />}
          </span>
        )}

        {/* Node icon */}
        {node.icon && <span className="shrink-0">{node.icon}</span>}

        {/* Label */}
        <span className="flex-1 truncate">{node.label}</span>

        {/* Selection indicator for single/multiple mode */}
        {selectionMode &&
          selectionMode !== "checkbox" &&
          selected && (
            <Check className="h-4 w-4 shrink-0 text-wex-tree-check-fg" />
          )}
      </div>

      {/* Children */}
      {children}
    </div>
  )
}

// ============================================================================
// Node Component (for custom rendering)
// ============================================================================

interface TreeNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  nodeKey: string
}

const TreeNode = React.forwardRef<HTMLDivElement, TreeNodeProps>(
  ({ className, nodeKey, children, ...props }, ref) => {
    const { isExpanded, isSelected, selectionMode, focusedKey, isKeyboardFocus } = useTreeContext()
    const expanded = isExpanded(nodeKey)
    const selected = isSelected(nodeKey)
    const focused = focusedKey === nodeKey && isKeyboardFocus

    return (
      <div
        ref={ref}
        role="treeitem"
        aria-expanded={expanded}
        aria-selected={selectionMode ? selected : undefined}
        data-focused={focused}
        className={className}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TreeNode.displayName = "WexTree.Node"

// ============================================================================
// Content Component
// ============================================================================

interface TreeContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const TreeContent = React.forwardRef<HTMLDivElement, TreeContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TreeContent.displayName = "WexTree.Content"

// ============================================================================
// Toggle Component
// ============================================================================

interface TreeToggleProps extends React.HTMLAttributes<HTMLSpanElement> {
  nodeKey: string
}

const TreeToggle = React.forwardRef<HTMLSpanElement, TreeToggleProps>(
  ({ className, nodeKey, ...props }, ref) => {
    const { isExpanded, toggleExpanded, nodes } = useTreeContext()
    const node = findNode(nodes, nodeKey)
    const hasChildren = node?.children && node.children.length > 0
    const expanded = isExpanded(nodeKey)

    if (!hasChildren) {
      return <span className="w-4 h-4" />
    }

    return (
      <span
        ref={ref}
        className={cn(
          "flex h-4 w-4 items-center justify-center shrink-0 cursor-pointer transition-transform",
          className
        )}
        onMouseDown={(e) => {
          // Prevent focus on mouse click
          if (e.button === 0) {
            e.preventDefault()
          }
        }}
        onClick={(e) => {
          e.stopPropagation()
          toggleExpanded(nodeKey)
        }}
        {...props}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            expanded && "rotate-90"
          )}
        />
      </span>
    )
  }
)
TreeToggle.displayName = "WexTree.Toggle"

// ============================================================================
// Footer Component
// ============================================================================

interface TreeFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const TreeFooter = React.forwardRef<HTMLDivElement, TreeFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-2 border-t", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TreeFooter.displayName = "WexTree.Footer"

// ============================================================================
// Empty Component
// ============================================================================

interface TreeEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const TreeEmpty = React.forwardRef<HTMLDivElement, TreeEmptyProps>(
  ({ className, children, ...props }, ref) => {
    const { getVisibleNodes, filterValue } = useTreeContext()
    
    // Only show if no visible nodes
    if (getVisibleNodes().length > 0 || !filterValue) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn("px-3 py-6 text-center text-sm text-wex-tree-empty-fg", className)}
        {...props}
      >
        {children || "No results found"}
      </div>
    )
  }
)
TreeEmpty.displayName = "WexTree.Empty"

// ============================================================================
// Compound Component Export
// ============================================================================

export const WexTree = Object.assign(WexTreeRoot, {
  Header: TreeHeader,
  Filter: TreeFilter,
  List: TreeList,
  Node: TreeNode,
  Content: TreeContent,
  Toggle: TreeToggle,
  Footer: TreeFooter,
  Empty: TreeEmpty,
})

// Export variants for external use
export { treeVariants, treeNodeVariants }
