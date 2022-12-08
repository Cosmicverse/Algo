/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, Daniel Jonathan <daniel at cosmicverse dot org>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES LOSS OF USE, DATA, OR PROFITS OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {
it,
expect,
describe
} from 'vitest'

import {
Optional,
guardFor
} from '@cosmicmind/foundation'

import {
  TreeKeys,
  Tree,
  TreeChildren,
  treeCreate,
  treeInsertChild,
  treeDepth,
  treeIsFirstChild,
  treeIsLastChild,
} from '../../src'

const sentinel = void 0

type TreeNode = Tree & {
  key: number
  value: string
}

const createTreeNode = (key: number, value: string): TreeNode =>
  treeCreate<TreeNode>({
    key,
    value,
  })

class TreeTrace implements Tree {
  readonly parent: Optional<Tree>
  readonly next: Optional<Tree>
  readonly previous: Optional<Tree>
  readonly children: Optional<TreeChildren<Tree>>
  readonly size: number
  readonly key: number
  readonly value: string
  constructor(key: number, value: string) {
    this.parent = sentinel
    this.next = sentinel
    this.previous = sentinel
    this.children = sentinel
    this.size = 1
    this.key = key
    this.value = value
  }
}

describe('Tree', () => {
  it('treeCreate', () => {
    const node = treeCreate({})

    expect(guardFor(node, ...TreeKeys)).toBeTruthy()
    expect(node.parent).toBe(sentinel)
    expect(node.next).toBe(sentinel)
    expect(node.previous).toBe(sentinel)
    expect(node.children).toBe(sentinel)
    expect(node.size).toBe(1)
  })

  it('createTreeNode', () => {
    const node = createTreeNode(1, 'a')

    expect(guardFor(node, ...TreeKeys, 'key', 'value')).toBeTruthy()
    expect(node.parent).toBe(sentinel)
    expect(node.next).toBe(sentinel)
    expect(node.previous).toBe(sentinel)
    expect(node.children).toBe(sentinel)
    expect(node.size).toBe(1)
    expect(node.key).toBe(1)
    expect(node.value).toBe('a')
  })

  it('new TreeTrace', () => {
    const node = new TreeTrace(1, 'a')

    expect(guardFor(node, ...TreeKeys, 'key', 'value')).toBeTruthy()
    expect(node.parent).toBe(sentinel)
    expect(node.next).toBe(sentinel)
    expect(node.previous).toBe(sentinel)
    expect(node.children).toBe(sentinel)
    expect(node.size).toBe(1)
    expect(node.key).toBe(1)
    expect(node.value).toBe('a')
  })

  it('treeInsertChild', () => {
    const n1 = createTreeNode(1, 'a')
    const n2 = createTreeNode(2, 'b')
    const n3 = createTreeNode(3, 'c')
    const n4 = createTreeNode(4, 'd')

    treeInsertChild(n2, n1)
    treeInsertChild(n3, n1)
    treeInsertChild(n4, n1)

    expect(treeIsFirstChild(n2, n1)).toBeFalsy()
    expect(treeIsFirstChild(n3, n1)).toBeFalsy()
    expect(treeIsFirstChild(n4, n1)).toBeTruthy()
    expect(treeIsLastChild(n2, n1)).toBeTruthy()
    expect(n1.size).toBe(4)
  })

  it('node.size', () => {
    const n1 = createTreeNode(1, 'a')
    const n2 = createTreeNode(2, 'b')
    const n3 = createTreeNode(3, 'c')
    const n4 = createTreeNode(4, 'd')
    const n5 = createTreeNode(5, 'e')
    const n6 = createTreeNode(6, 'f')
    const n7 = createTreeNode(7, 'g')

    treeInsertChild(n2, n1)
    treeInsertChild(n3, n1)
    treeInsertChild(n4, n1)
    treeInsertChild(n5, n1)
    treeInsertChild(n6, n1)
    treeInsertChild(n7, n2)

    expect(n1.size).toBe(7)
    expect(n2.size).toBe(2)
    expect(n3.size).toBe(1)
    expect(n4.size).toBe(1)
  })

  it('treeDepth', () => {
    const n1 = createTreeNode(1, 'a')
    const n2 = createTreeNode(2, 'b')
    const n3 = createTreeNode(3, 'c')
    const n4 = createTreeNode(4, 'd')
    const n5 = createTreeNode(5, 'e')
    const n6 = createTreeNode(6, 'f')
    const n7 = createTreeNode(7, 'g')

    treeInsertChild(n2, n1)
    treeInsertChild(n3, n1)
    treeInsertChild(n4, n1)
    treeInsertChild(n5, n1)
    treeInsertChild(n6, n2)
    treeInsertChild(n7, n2)

    expect(treeDepth(n1)).toBe(0)
    expect(treeDepth(n2)).toBe(1)
    expect(treeDepth(n3)).toBe(1)
    expect(treeDepth(n4)).toBe(1)
    expect(treeDepth(n5)).toBe(1)
    expect(treeDepth(n6)).toBe(2)
    expect(treeDepth(n7)).toBe(2)
  })
})